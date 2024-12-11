import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { MessageService } from './message.service';
import { CreateChatDto } from '@/domains/chat/create-chat.dto';
import { UserDto } from '@/domains/user/user.dto';
import { ChatDto } from '@/domains/chat/chat.dto';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSocket } from './entities/user-socket.entity';
import { Repository } from 'typeorm';
import { CreateChatGroupDto } from '@/domains/chat/create-chat-group.dto';
import { UseGuards } from '@nestjs/common';
import { WsGuard } from './guard/chat.guard';

@WebSocketGateway({ cors: { origin: '*' } })
@UseGuards(WsGuard)
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    @InjectRepository(UserSocket)
    private userSocketRepository: Repository<UserSocket>,
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UsersService,
    private readonly logger: WinstonLoggerService,
  ) {}

  // Called once when the gateway is initialized
  afterInit() {
    this.logger.error(`chat-afterInit`, {
      description: `chat afterInit`,
      class: ChatGateway.name,
      function: 'afterInit',
      message: 'Chat Initialized',
    });
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      await this.createOrUpdateUserSocket(userId, client.id);
      const roomIds = await this.chatService.getUserChatIds(userId); // Fetch all chats the user is part of
      roomIds.forEach((roomId) => client.join(roomId));
      this.logger.info(`chat-connection`, {
        description: `chat Notification`,
        class: ChatGateway.name,
        function: 'handleConnection',
        message: `client ${client.id} User ${userId} joined rooms: ${roomIds}`,
      });
    }
  }

  /**
   * Handle user disconnection.
   */
  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    await this.removeUserSocket(userId);
    this.logger.info(`chat-handleDisconnect`, {
      description: `chat handleDisconnect`,
      class: ChatGateway.name,
      function: 'handleDisconnect',
      message: `User ${userId} disconnected.`,
    });
  }

  /**
   * Handle sending private messages (one-to-one).
   * If chatId is provided, it uses the existing chat, otherwise, it creates one.
   */
  @SubscribeMessage('send_message')
  async handlePrivateMessage(
    @MessageBody()
    data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const createChatDto = new CreateChatDto(JSON.parse(data));

    // TODO CHECK WHY TRIGGER EXCEPTION await Utils.validateDtoOrFail(createChatDto);
    const { chatId, senderId, receiverId, content, contentType } =
      createChatDto;
    try {
      const resolvedChat = chatId
        ? await this.chatService.findOneOrFail({ id: chatId })
        : await this.chatService.createOneToOne({ senderId, receiverId });

      const message = await this.messageService.create({
        chat: resolvedChat as unknown as ChatDto,
        sender: resolvedChat.sender as unknown as UserDto,
        content,
        contentType,
      });

      // Ensure sender and receiver join the room
      const roomId = resolvedChat.id;
      const receiverSocket = await this.getReceiverSocket(receiverId);
      !receiverSocket.rooms.has(roomId) && (await receiverSocket.join(roomId));
      !client.rooms.has(roomId) && (await client.join(roomId));
      console.log(
        'receiver id',
        receiverSocket.rooms.has(roomId),
        'sender id',
        client.rooms.has(roomId),
      );
      this.server
        .to(roomId)
        .emit('receive_message', { chatId: resolvedChat.id, message });
    } catch (error) {
      client.emit('error', 'Unable to send private message.');
      throw new WsException(`Invalid receiverSocket ${error}`);
    }
  }

  // Fetch chat history
  /**
   * Handle sending group messages.
   */
  @SubscribeMessage('send_group_message')
  async handleGroupMessage(
    @MessageBody()
    data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const createChatGroup = new CreateChatGroupDto(JSON.parse(data));
    const { chatId, senderId, content, contentType } = createChatGroup;

    try {
      // Validate the group chat
      const resolvedChat = await this.chatService.findOneOrFail(
        { id: chatId, isGroup: true },
        { participants: true },
      );
      const sender = await this.userService.findOneOrFail({ id: senderId });
      const message = this.messageService.create({
        chat: resolvedChat as unknown as ChatDto,
        sender: sender as unknown as UserDto,
        content,
        contentType,
      });
      const roomId = resolvedChat.id;

      // Assuming chat.participants is an array of user objects that are part of the chat
      for (const participant of resolvedChat.participants!) {
        const receiverSocket = await this.getReceiverSocket(participant.id);
        await receiverSocket.join(roomId);
      }
      await client.join(roomId);
      // Emit to the group chat room
      this.server.to(chatId).emit('receive_group_message', { chatId, message });
    } catch (error) {
      this.logger.error(`chat-handleGroupMessage`, {
        description: `chat handleGroupMessage`,
        class: ChatGateway.name,
        function: 'handleGroupMessage',
        error,
      });
      client.emit('error', 'Unable to send group message.');
    }
  }

  async createOrUpdateUserSocket(
    userId: string,
    socketId: string,
  ): Promise<void> {
    const existingSocket = await this.userSocketRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });

    if (existingSocket) {
      // Update existing socket
      existingSocket.socketId = socketId;
      await this.userSocketRepository.save(existingSocket);
    } else {
      // Create new socket
      const newSocket = this.userSocketRepository.create({
        user: await this.userService.findOneOrFail({ id: userId }),
        socketId,
      });
      await this.userSocketRepository.save(newSocket);
    }
  }

  /**
   * Remove a user's socket from the database.
   */
  async removeUserSocket(userId: string): Promise<void> {
    await this.userSocketRepository.delete({ user: { id: userId } });
  }

  /**
   * Get the socket of a receiver by their userId.
   * @param receiverId - The userId of the receiver.
   * @returns {Socket} - The receiver's socket instance.
   * @throws {WsException} - If the receiver's socket ID or socket is invalid.
   */
  async getReceiverSocket(receiverId: string): Promise<Socket> {
    const receiverSocketId = await this.userSocketRepository.findOneOrFail({
      where: {
        user: {
          id: receiverId,
        },
      },
    });
    if (!receiverSocketId) {
      throw new WsException(
        'Invalid receiverSocketId. Receiver not connected.',
      );
    }
    const receiverSocket = this.server.sockets.sockets.get(
      receiverSocketId.socketId,
    );
    if (!receiverSocket) {
      throw new WsException('Invalid receiverSocket. Socket not found.');
    }
    return receiverSocket;
  }
}

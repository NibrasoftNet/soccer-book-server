import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { MessageService } from './message.service';
import { User } from '../users/entities/user.entity';
import { MessageTypeEnum } from '@/enums/chat/message-type.enum';
import { CreateChatDto } from '@/domains/chat/create-chat.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
    private readonly userService: UsersService,
  ) {}

  // Called once when the gateway is initialized
  afterInit() {
    console.log('Chat WebSocket Initialized');
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const roomIds = await this.chatService.getUserChatIds(userId); // Fetch all chats the user is part of
      roomIds.forEach((roomId) => client.join(roomId));
      console.log(`User ${userId} joined rooms:`, roomIds);
    }
  }

  /**
   * Handle user disconnection.
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    console.log(`User ${userId} disconnected.`);
  }

  /**
   * Handle sending private messages (one-to-one).
   * If chatId is provided, it uses the existing chat, otherwise, it creates one.
   */
  @SubscribeMessage('send_message')
  async handlePrivateMessage(
    @MessageBody()
    data: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, senderId, receiverId, content, contentType } = data;

    try {
      const resolvedChat = chatId
        ? await this.chatService.findOneOrFail({ id: chatId })
        : await this.chatService.createOneToOne({ senderId, receiverId });

      const message = this.messageService.create(
        resolvedChat,
        resolvedChat.sender as User,
        content,
        contentType,
      );

      // Ensure sender and receiver join the room
      const roomId = resolvedChat.id;
      await client.join(roomId); // Sender joins the room
      const receiverSocket = this.server.sockets.sockets.get(receiverId); // Assume receiverId maps to their socket ID
      if (receiverSocket) {
        await receiverSocket.join(roomId); // Receiver joins the room
      }

      this.server
        .to(resolvedChat.id)
        .emit('receive_message', { chatId: resolvedChat.id, message });
    } catch (error) {
      console.error('Error sending private message:', error);
      client.emit('error', 'Unable to send private message.');
    }
  }

  // Fetch chat history
  /**
   * Handle sending group messages.
   */
  @SubscribeMessage('send_group_message')
  async handleGroupMessage(
    @MessageBody()
    data: {
      chatId: string;
      senderId: string;
      content: string[];
      contentType: MessageTypeEnum;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, senderId, content, contentType } = data;

    try {
      // Validate the group chat
      const resolvedChat = await this.chatService.findOneOrFail(
        { id: chatId, isGroup: true },
        { participants: true },
      );
      const sender = await this.userService.findOneOrFail({ id: senderId });
      const message = this.messageService.create(
        resolvedChat,
        sender,
        content,
        contentType,
      );
      const roomId = resolvedChat.id;
      await client.join(roomId);
      // Assuming chat.participants is an array of user objects that are part of the chat
      for (const participant of resolvedChat.participants!) {
        const socket = this.server.sockets.sockets.get(participant.id);
        socket && (await socket.join(roomId));
      }

      // Emit to the group chat room
      this.server.to(chatId).emit('receive_group_message', { chatId, message });
    } catch (error) {
      console.error('Error sending group message:', error);
      client.emit('error', 'Unable to send group message.');
    }
  }
}

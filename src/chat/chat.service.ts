import { Injectable } from '@nestjs/common';
import { CreateOneToOneChatDto } from '@/domains/chat/create-one-to-one-chat.dto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from '@/domains/chat/create-group.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Arena } from '../arena/entities/arena.entity';
import { arenaPaginationConfig } from '../arena/config/arena-pagination-config';
import { chatPaginationConfig } from './config/chat-pagination-config';
import { UpdateChatDto } from '@/domains/chat/update-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly userService: UsersService,
  ) {}
  async createOneToOne(
    createOneToOneChatDto: CreateOneToOneChatDto,
  ): Promise<Chat> {
    const existingChat = await this.chatRepository.findOne({
      where: [
        {
          sender: { id: createOneToOneChatDto.senderId },
          receiver: { id: createOneToOneChatDto.receiverId },
        },
        {
          sender: { id: createOneToOneChatDto.receiverId },
          receiver: { id: createOneToOneChatDto.senderId },
        },
      ],
    });

    if (!!existingChat) {
      return existingChat;
    }

    const chat = this.chatRepository.create();
    chat.sender = await this.userService.findOneOrFail({
      id: createOneToOneChatDto.senderId,
    });
    chat.receiver = await this.userService.findOneOrFail({
      id: createOneToOneChatDto.receiverId,
    });
    return await this.chatRepository.save(chat);
  }

  async createGroup(
    userJwtPayload: JwtPayloadType,
    createGroupChatDto: CreateGroupDto,
  ): Promise<Chat> {
    const chat = this.chatRepository.create({
      name: createGroupChatDto.name,
    });
    chat.creator = await this.userService.findOneOrFail({
      id: userJwtPayload.id,
    });
    chat.isGroup = true;
    return await this.chatRepository.save(chat);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Chat>> {
    return await paginate<Chat>(
      query,
      this.chatRepository,
      chatPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<Chat>> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('chat.participants', 'participants')
      .where('sender.id = :userId', { userId: userJwtPayload.id })
      .orWhere('receiver.id = :userId', { userId: userJwtPayload.id })
      .orWhere('creator.id = :userId', { userId: userJwtPayload.id })
      .orWhere('participants.id = :userId', { userId: userJwtPayload.id });
    return await paginate<Chat>(query, queryBuilder, chatPaginationConfig);
  }

  async getUserChatIds(userId: string): Promise<string[]> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.sender', 'sender')
      .leftJoinAndSelect('chat.receiver', 'receiver')
      .leftJoinAndSelect('chat.creator', 'creator')
      .leftJoinAndSelect('chat.participants', 'participants')
      .where('sender.id = :userId', { userId })
      .orWhere('receiver.id = :userId', { userId })
      .orWhere('creator.id = :userId', { userId })
      .orWhere('participants.id = :userId', { userId })
      .select('chat.id', 'chatId');

    const result = await queryBuilder.getRawMany();
    console.log('res', result);
    return result.map((row) => row.chatId);
  }

  async findOne(
    field: FindOptionsWhere<Chat>,
    relations?: FindOptionsRelations<Chat>,
  ): Promise<NullableType<Chat>> {
    return await this.chatRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Chat>,
    relations?: FindOptionsRelations<Chat>,
  ): Promise<Chat> {
    return await this.chatRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateChatDto: UpdateChatDto): Promise<Chat> {
    const chat = await this.findOneOrFail({ id });
    Object.assign(chat, updateChatDto);
    return await chat.save();
  }

  async remove(id: string) {
    return await this.chatRepository.delete({ id });
  }
}

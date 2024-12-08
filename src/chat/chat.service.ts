import { Injectable } from '@nestjs/common';
import { CreateOneToOneChatDto } from '@/domains/chat/create-one-to-one-chat.dto';
import { UpdateGroupChatDto } from '@/domains/chat/update-chat.dto';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { CreateGroupChatDto } from '@/domains/chat/create-group-chat.dto';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';

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
    createGroupChatDto: CreateGroupChatDto,
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

  findAll() {
    return `This action returns all chat`;
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

  async update(
    id: string,
    updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<Chat> {
    const chat = await this.findOneOrFail({ id });
    Object.assign(chat, updateGroupChatDto);
    return await this.chatRepository.save(chat);
  }

  async remove(id: string) {
    return await this.chatRepository.delete({ id });
  }
}

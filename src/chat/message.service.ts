import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { UpdateChatMessageDto } from '@/domains/chat/update-chat-message.dto';
import { CreateChatMessageDto } from '@/domains/chat/create-chat-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createChatMessageDto: CreateChatMessageDto): Promise<Message> {
    const message = this.messageRepository.create(
      createChatMessageDto as DeepPartial<Message>,
    );
    message.sender = createChatMessageDto.sender as unknown as User;
    message.chat = createChatMessageDto.chat as unknown as Chat;
    message.content = createChatMessageDto.content;
    return await this.messageRepository.save(message);
  }

  findAll() {
    return `This action returns all chat`;
  }

  async findOne(
    field: FindOptionsWhere<Message>,
    relations?: FindOptionsRelations<Message>,
  ): Promise<NullableType<Message>> {
    return await this.messageRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Message>,
    relations?: FindOptionsRelations<Message>,
  ): Promise<Message> {
    return await this.messageRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateChatMessageDto: UpdateChatMessageDto) {
    const message = await this.findOneOrFail({ id });
    Object.assign(message, updateChatMessageDto);
    return await this.messageRepository.save(message);
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}

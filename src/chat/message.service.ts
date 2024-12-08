import { Injectable } from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message, MessageType } from './entities/message.entity';
import { User } from '../users/entities/user.entity';
import { UpdateGroupChatDto } from '@/domains/chat/update-chat.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(
    chat: Chat,
    sender: User,
    content: string,
    contentType: MessageType,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      content,
      contentType,
    });
    message.sender = sender;
    message.chat = chat;
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

  async update(id: string, updateGroupChatDto: UpdateGroupChatDto) {
    const message = await this.findOneOrFail({ id });
    Object.assign(message, updateGroupChatDto);
    return await this.messageRepository.save(message);
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}

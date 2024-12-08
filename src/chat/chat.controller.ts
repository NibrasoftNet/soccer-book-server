import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { CreateGroupChatDto } from '@/domains/chat/create-group-chat.dto';
import { MapInterceptor } from 'automapper-nestjs';
import { ChatDto } from '@/domains/chat/chat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateGroupChatDto } from '@/domains/chat/update-chat.dto';
import { NullableType } from '../utils/types/nullable.type';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'chats' })
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('group')
  async createGroup(
    @Request() request,
    @Body() createGroupChatDto: CreateGroupChatDto,
  ): Promise<Chat> {
    return await this.chatService.createGroup(request.user, createGroupChatDto);
  }

  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Chat>> {
    return await this.chatService.findOne({ id });
  }

  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupChatDto: UpdateGroupChatDto,
  ): Promise<Chat> {
    return await this.chatService.update(id, updateGroupChatDto);
  }
}

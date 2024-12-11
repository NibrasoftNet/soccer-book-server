import { ChatService } from './chat.service';
import {
  Body,
  Controller,
  Delete,
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
import { CreateGroupDto } from '@/domains/chat/create-group.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { ChatDto } from '@/domains/chat/chat.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { chatPaginationConfig } from './config/chat-pagination-config';
import { Mapper } from 'automapper-core';
import { UpdateChatDto } from '@/domains/chat/update-chat.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'chats' })
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.CREATED)
  @Post('group')
  async createGroup(
    @Request() request,
    @Body() createGroupChatDto: CreateGroupDto,
  ): Promise<Chat> {
    return await this.chatService.createGroup(request.user, createGroupChatDto);
  }

  @ApiPaginationQuery(chatPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Chat, ChatDto>> {
    const chats = await this.chatService.findAll(query);
    return new PaginatedDto<Chat, ChatDto>(this.mapper, chats, Chat, ChatDto);
  }

  @ApiPaginationQuery(chatPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('all/me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Chat, ChatDto>> {
    const chats = await this.chatService.findAllMe(request.user, query);
    return new PaginatedDto<Chat, ChatDto>(this.mapper, chats, Chat, ChatDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Chat>> {
    return await this.chatService.findOne({ id });
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Chat, ChatDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto,
  ): Promise<Chat> {
    return await this.chatService.update(id, updateChatDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.chatService.remove(id);
  }
}

import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Message } from './entities/message.entity';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { ChatController } from './chat.controller';
import { ChatSerializationProfile } from './serialization/chat-serialization.profile';
import { MessageService } from './message.service';
import { FilesModule } from '../files/files.module';
import { UserSocket } from './entities/user-socket.entity';
import { UserSocketSerializationProfile } from './serialization/user-socket-serialization.profile';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message, UserSocket]),
    UsersModule,
    FilesModule,
    JwtModule.register({}),
  ],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    MessageService,
    ChatSerializationProfile,
    UserSocketSerializationProfile,
  ],
})
export class ChatModule {}

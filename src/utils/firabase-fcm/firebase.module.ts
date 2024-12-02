import { Module, Global } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseMessagingService } from './firebase.service';

@Global()
@Module({
  providers: [FirebaseProvider, FirebaseMessagingService],
  exports: [FirebaseMessagingService],
})
export class FirebaseModule {}

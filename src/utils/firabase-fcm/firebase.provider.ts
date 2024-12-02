import * as firebaseAdmin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const FirebaseProvider: Provider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: (configService: ConfigService): firebaseAdmin.app.App => {
    try {
      return firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: configService.get<string>(
            'FIREBASE_MESSAGING_PROJECT_ID',
            { infer: true },
          ),
          clientEmail: configService.get<string>(
            'FIREBASE_MESSAGING_CLIENT_EMAIL',
            { infer: true },
          ),
          privateKey: `-----BEGIN PRIVATE KEY-----${configService.get<string>(
            'FIREBASE_MESSAGING_PRIVATE_KEY',
            { infer: true },
          )}-----END PRIVATE KEY-----\n`,
        }),
      });
    } catch (error) {
      throw new Error(`Firebase initialization failed: ${error.message}`);
    }
  },
  inject: [ConfigService],
};

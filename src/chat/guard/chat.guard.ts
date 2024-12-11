import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    const { query } = client.handshake;

    //const token = query.token as string;
    const userId = query.userId as string;

    if (!userId) {
      console.log('payload', userId);
      //throw new WsException('Unauthorized: Missing token or userId');
    }

    try {
      // Validate the token
      /*      const payload = this.jwtService.verify(token, {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
      });
      console.log('payload', payload);
      // Verify the token's userId matches the provided userId
      if (payload.id !== userId) {
        //throw new WsException('Unauthorized: userId mismatch');
      }*/

      // Attach user information to the client for later use
      client.user = { userId };

      return true; // Connection is allowed
    } catch (error) {
      throw new WsException(`Unauthorized: ${error.message}`);
    }
  }
}

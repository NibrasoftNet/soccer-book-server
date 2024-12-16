import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { FastifyInstance } from 'fastify';
import fastifyBasicAuth from '@fastify/basic-auth';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SwaggerAuthService implements OnModuleInit {
  constructor(
    private readonly app: INestApplication,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const fastify: FastifyInstance = this.app.getHttpAdapter().getInstance();

    // Register basic auth plugin
    await fastify.register(fastifyBasicAuth, {
      validate: (username: string, password: string, req, reply, done) => {
        if (
          username ===
            this.configService.getOrThrow<string>('app.swaggerUsername', {
              infer: true,
            }) &&
          password ===
            this.configService.getOrThrow<string>('app.swaggerPassword', {
              infer: true,
            })
        ) {
          done();
        } else {
          done(new Error('Swagger Authentication went wrong'));
        }
      },
      authenticate: true,
    });

    // Add hook to Swagger route
    fastify.addHook('preValidation', (req, reply, done) => {
      if (req.raw.url?.startsWith('/docs')) {
        if (!req.headers.authorization) {
          void reply
            .code(401)
            .header('WWW-Authenticate', 'Basic realm="Swagger Docs"')
            .send({ error: 'Unauthorized: Missing Authorization header.' });
        } else {
          fastify.basicAuth(req, reply, done);
        }
      } else {
        done();
      }
    });
  }
}

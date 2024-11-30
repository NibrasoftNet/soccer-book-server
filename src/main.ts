import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import {
  initializeTransactionalContext,
  StorageDriver,
} from 'typeorm-transactional';
import validationOptions from './utils/validation-options';
import { ResponseInterceptor } from './utils/interceptors/response.interceptor';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { HttpExceptionFilter } from './utils/exceptions/http-exception.filter';
import { WorkerService } from 'nestjs-graphile-worker';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { RolesSerializerInterceptor } from './utils/interceptors/role.serializer.interceptor';
import { contentParser } from 'fastify-file-interceptor';
// import authPlugin from '@fastify/auth';

const logger = new Logger('Soccer-main');
/*const whitelist = [
  'http://localhost:5000',
  'http://localhost:1001',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5001',
];*/

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      abortOnError: true,
    },
  );
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true, // fallbackOnErrors must be true
  });
  const configService = app.get(ConfigService<AllConfigType>);
  /*  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (
        whitelist.includes(origin) || // Checks your whitelist
        !!origin.match(/soccer-book\.com$/) // Overall check for your domain
      ) {
        logger.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        logger.error('blocked cors for:', origin);
        callback(new ImATeapotException('Not allowed by CORS'), false);
      }
    },
  });*/

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.register(contentParser);
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(WinstonLoggerService)));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new RolesSerializerInterceptor(app.get(Reflector)),
    new ResponseInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('Soccer booking API')
    .setDescription('Swagger docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
  await app.get(WorkerService).run();
  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    () => {
      logger.log(
        `${configService.getOrThrow('app.name', {
          infer: true,
        })} Server is listening to port ${configService.getOrThrow('app.port', {
          infer: true,
        })}...`,
      );
    },
  );
}

void bootstrap().catch((e) => {
  logger.error(`❌  Error starting server, ${e}`, '', 'Bootstrap');
  throw e;
});

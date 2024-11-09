import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { WinstonLoggerService } from '../../logger/winston-logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    this.errorHandler(exception, host);
  }

  errorHandler(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status =
      exception && typeof exception.getStatus === 'function'
        ? exception.getStatus()
        : 500;

    let errorMessage: string;
    if (exception && typeof exception.getStatus === 'function') {
      if (typeof exception.getResponse() === 'string') {
        errorMessage =
          exception.getStatus() !== 500
            ? (exception.getResponse() as string)
            : JSON.stringify({ httpEntityException: exception.getResponse() });
      } else {
        const responseObj = exception.getResponse() as Record<string, any>;
        errorMessage = responseObj['errors']
          ? JSON.stringify(responseObj['errors'])
          : responseObj['message'];
      }
    } else {
      errorMessage = exception.message;
    }

    this.loggerService.error(request.url, {
      description: request.url,
      class: HttpException.name,
      function: 'exception',
      exception,
    });

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: errorMessage,
      stack: exception.stack,
    });
  }
}

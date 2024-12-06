import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { EntityNotFoundError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    this.handleException(exception, host);
  }

  exceptionHandlers: Record<
    string,
    (exception: any, host: ArgumentsHost) => void
  > = {
    EntityNotFoundError: (exception, host) =>
      this.handleEntityNotFoundError(exception, host),
    HttpException: (exception, host) =>
      this.handleHttpException(exception, host),
  };

  handleException(exception: any, host: any): void {
    const handler = this.exceptionHandlers[exception.constructor.name];
    if (!handler) {
      this.handleUnknownException(exception, host);
      return;
    }

    handler(exception, host);
  }

  handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    this.logError(request, 'HttpException', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.getResponse(),
      stack: exception.stack,
    });
  }

  private handleEntityNotFoundError(
    exception: EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = HttpStatus.PRECONDITION_FAILED; // EntityNotFoundError is treated as 404

    this.logError(request, 'EntityNotFoundError', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.PRECONDITION_FAILED,
        errors: {
          entity: exception.message,
        },
      },
      stack: exception.stack,
    });
  }

  private handleUnknownException(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR; // Default to 500 for unknown exceptions

    this.logError(request, 'UnknownException', exception);

    void response.status(status).send({
      status: false,
      statusCode: status,
      path: request.url,
      message: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        errors: {
          message: exception instanceof Error ? exception.message : 'Unknown',
        },
      },
      stack: exception instanceof Error ? exception.stack : null,
    });
  }

  private logError(
    request: FastifyRequest,
    exceptionType: string,
    exception: unknown,
  ) {
    this.loggerService.error(request.url, {
      description: request.url,
      class: exceptionType,
      function: 'exception',
      exception,
    });
  }
}

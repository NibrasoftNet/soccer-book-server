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
    switch (exception.constructor) {
      case EntityNotFoundError:
        this.handleEntityNotFoundError(exception, host);
        break;
      case HttpException:
        this.handleHttpException(exception, host);
        break;
      default:
        this.handleUnknownException(exception, host);
        break;
    }
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

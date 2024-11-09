import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpResponseException extends HttpException {
  constructor(error) {
    super(
      error?.message || 'Internal Server Error',
      error?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

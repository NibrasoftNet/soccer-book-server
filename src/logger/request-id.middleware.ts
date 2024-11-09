import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(_req: Request, res: Response, next: NextFunction) {
    const requestIdHeader = randomStringGenerator();
    res.set('X-Request-Id', requestIdHeader);
    next();
  }
}

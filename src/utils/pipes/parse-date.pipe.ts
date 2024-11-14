import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date | undefined> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value?: string, metadata?: ArgumentMetadata): Date | undefined {
    if (value) {
      const parsedDate = new Date(value);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException(
          `{"date": "data format invalid"}`,
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      return parsedDate;
    }
  }
}

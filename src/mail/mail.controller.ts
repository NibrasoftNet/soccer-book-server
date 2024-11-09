import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponseException } from '../utils/exceptions/http-response.exception';
import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send/dummy')
  async sendDummyMail(): Promise<void> {
    try {
      await this.mailService.sendDummyMail();
    } catch (error) {
      console.log('Error sending mail', error);
      throw new HttpResponseException(error);
    }
  }
}

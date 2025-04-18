import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nContext } from 'nestjs-i18n';
import { MailData } from './interfaces/mail-data.interface';
import { AllConfigType } from 'src/config/config.type';
import { MaybeType } from '../utils/types/maybe.type';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async userSignUp(mailData: MailData<{ otp: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let verifyOtpTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    const text4: string = mailData.data.otp.toString();

    if (i18n) {
      [verifyOtpTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.confirmEmail'),
        i18n.t('confirm-email.text1'),
        i18n.t('confirm-email.text2'),
        i18n.t('confirm-email.text3'),
      ]);
    }
    await this.sendEmail({
      to: mailData.to,
      subject: verifyOtpTitle,
      text: verifyOtpTitle,
      templatePath: path.join(__dirname, 'templates', 'activation.hbs'),
      context: {
        title: verifyOtpTitle,
        actionTitle: verifyOtpTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async forgotPassword(mailData: MailData<{ otp: string }>): Promise<void> {
    const i18n = I18nContext.current();
    let resetPasswordTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    const text4: string = mailData.data.otp.toString();

    if (i18n) {
      [resetPasswordTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.resetPassword'),
        i18n.t('reset-password.text1'),
        i18n.t('reset-password.text2'),
        i18n.t('reset-password.text3'),
      ]);
    }

    await this.sendEmail({
      to: mailData.to,
      subject: resetPasswordTitle,
      text: resetPasswordTitle,
      templatePath: path.join(__dirname, 'templates', 'reset-password.hbs'),
      context: {
        title: resetPasswordTitle,
        actionTitle: resetPasswordTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }

  async sendEmail({
    to,
    templatePath,
    subject,
    context,
    ...mailOptions
  }: nodemailer.SendMailOptions & {
    to: string;
    templatePath?: string;
    subject?: string;
    context?: Record<string, unknown>;
  }): Promise<void> {
    try {
      let html: string | Buffer | undefined;
      if (templatePath) {
        const template = await fs.readFile(templatePath, 'utf-8');
        html = Handlebars.compile(template, { strict: true })(context || {});
      }
      const sendingExportEmailOptions: ISendMailOptions = {
        from: mailOptions.from
          ? mailOptions.from
          : `"${this.configService.get('mail.defaultName', {
              infer: true,
            })}" <${this.configService.get('mail.defaultEmail', {
              infer: true,
            })}>`,
        to,
        subject,
        html: html,
        //context,
      };
      await this.mailerService.sendMail(sendingExportEmailOptions);
    } catch (error) {
      this.logger.error('Failed to send email', error.stack);
      throw new HttpException(
        {
          status: HttpStatus.EXPECTATION_FAILED,
          errors: {
            email: `email sending failed" ${error}`,
          },
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
  async sendDummyMail() {
    const result = await this.mailerService.sendMail({
      from: 'help@soccer.com',
      to: 'weavers.top@gmail.com',
      subject: 'WELCOME',
      text: 'hello world',
    });
    this.logger.log('Success send email', result);
  }

  async resendOtp(mailData: MailData<{ otp: number }>): Promise<void> {
    const i18n = I18nContext.current();
    let verifyOtpTitle: MaybeType<string>;
    let text1: MaybeType<string>;
    let text2: MaybeType<string>;
    let text3: MaybeType<string>;
    const text4: string = mailData.data.otp.toString();

    if (i18n) {
      [verifyOtpTitle, text1, text2, text3] = await Promise.all([
        i18n.t('common.resendOtp'),
        i18n.t('resend-otp.text1'),
        i18n.t('resend-otp.text2'),
        i18n.t('resend-otp.text3'),
      ]);
    }
    await this.sendEmail({
      to: mailData.to,
      subject: verifyOtpTitle,
      text: verifyOtpTitle,
      templatePath: path.join(__dirname, 'templates', 'activation.hbs'),
      context: {
        title: verifyOtpTitle,
        actionTitle: verifyOtpTitle,
        app_name: this.configService.get('app.name', {
          infer: true,
        }),
        text1,
        text2,
        text3,
        text4,
      },
    });
  }
}

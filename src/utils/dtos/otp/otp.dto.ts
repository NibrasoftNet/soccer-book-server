import { AutoMap } from 'automapper-classes';
export class OtpDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  otp: string;

  @AutoMap()
  expireIn: number;

  constructor(email: string, otp: string, expireIn: number) {
    this.email = email;
    this.otp = otp;
    this.expireIn = expireIn;
  }
}

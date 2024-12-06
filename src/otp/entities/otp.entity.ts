import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ type: 'bigint' })
  expireIn: number;

  @Column()
  otp: string;

  @Column({ default: false })
  validated: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async setOtp() {
    if (this.otp) {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt.toString());
    }
  }
}

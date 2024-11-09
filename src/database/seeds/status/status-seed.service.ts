import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from '../../../statuses/entities/status.entity';
import { Repository } from 'typeorm';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(Status)
    private repository: Repository<Status>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      await this.repository.save([
        this.repository.create({
          id: StatusCodeEnum.ACTIVE,
          name: 'ACTIVE',
          code: StatusCodeEnum.ACTIVE,
        }),
        this.repository.create({
          id: StatusCodeEnum.INACTIVE,
          name: 'INACTIVE',
          code: StatusCodeEnum.INACTIVE,
        }),
      ]);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../../../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { RoleCodeEnum } from '@/enums/role/roles.enum';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RoleCodeEnum.ADMIN,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.ADMIN,
          name: 'ADMIN',
          code: RoleCodeEnum.ADMIN,
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RoleCodeEnum.USER,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.USER,
          name: 'USER',
          code: RoleCodeEnum.USER,
        }),
      );
    }

    const countCollectivity = await this.repository.count({
      where: {
        id: RoleCodeEnum.SUPERADMIN,
      },
    });

    if (!countCollectivity) {
      await this.repository.save(
        this.repository.create({
          id: RoleCodeEnum.SUPERADMIN,
          name: 'SUPERADMIN',
          code: RoleCodeEnum.SUPERADMIN,
        }),
      );
    }
  }
}

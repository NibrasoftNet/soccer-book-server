import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserAdmin } from './entities/user-admin.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { FilesService } from '../files/files.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { NullableType } from '../utils/types/nullable.type';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { CreateUserAdminDto } from '@/domains/user-admin/create-user-admin.dto';
import { usersAdminPaginationConfig } from './configs/users-admin-pagination.config';
import { plainToClass } from 'class-transformer';
import { Status } from '../statuses/entities/status.entity';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { Role } from '../roles/entities/role.entity';
import { MulterFile } from 'fastify-file-interceptor';

@Injectable()
export class UsersAdminService {
  constructor(
    @InjectRepository(UserAdmin)
    private usersAdminRepository: Repository<UserAdmin>,
    private fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}
  async create(createProfileDto: CreateUserAdminDto): Promise<UserAdmin> {
    const admin = this.usersAdminRepository.create(createProfileDto);
    admin.status = plainToClass(Status, {
      id: StatusCodeEnum.ACTIVE,
      code: StatusCodeEnum.ACTIVE,
    });

    admin.role = plainToClass(Role, {
      id: RoleCodeEnum.ADMIN,
      code: RoleCodeEnum.ADMIN,
    });

    return await this.usersAdminRepository.save(admin);
  }

  async findManyWithPagination(
    query: PaginateQuery,
  ): Promise<Paginated<UserAdmin>> {
    return await paginate(
      query,
      this.usersAdminRepository,
      usersAdminPaginationConfig,
    );
  }

  async findOne(
    fields: FindOptionsWhere<UserAdmin>,
    relations?: FindOptionsRelations<UserAdmin>,
  ): Promise<NullableType<UserAdmin>> {
    return await this.usersAdminRepository.findOne({
      where: fields,
      relations,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<UserAdmin>,
    relations?: FindOptionsRelations<UserAdmin>,
  ): Promise<UserAdmin> {
    return this.usersAdminRepository.findOneOrFail({
      where: fields,
      relations,
    });
  }

  async update(
    id: string,
    updateUserDto: AuthUpdateDto,
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<UserAdmin> {
    const user = await this.findOneOrFail({ id });
    Object.assign(user, updateUserDto);
    if (!!file) {
      user.photo = user?.photo?.id
        ? await this.fileService.updateFile(user?.photo?.id, file)
        : await this.fileService.uploadFile(file);
    }
    return this.usersAdminRepository.save(user);
  }

  async softDelete(id: UserAdmin['id']): Promise<UpdateResult> {
    return await this.usersAdminRepository.softDelete(id);
  }

  async restoreUserByEmail(
    email: UserAdmin['email'],
  ): Promise<UserAdmin | null> {
    // Find the user by email, including soft-deleted ones
    const user = await this.usersAdminRepository.findOne({
      withDeleted: true,
      where: { email },
    });

    if (user && user.deletedAt) {
      // If the user is found and is soft-deleted, restore the user
      await this.usersAdminRepository.restore(user.id);
      return user;
    }
    // Return null if no user was found or the user was not deleted
    return null;
  }

  async findAllUsersToken(userIds?: number[]): Promise<string[]> {
    const query = this.usersAdminRepository
      .createQueryBuilder('user')
      .select('user.notificationToken')
      .where('user.notificationToken IS NOT NULL'); // To avoid selecting null values

    // If userIds are provided, filter by user IDs
    if (userIds && userIds.length > 0) {
      query.andWhere('user.id IN (:...userIds)', { userIds });
    }

    const result = await query.getMany();

    // Extract the notification tokens as an array of strings
    return result.map((user) => user.notificationsToken) as string[];
  }

  async findAllUsersByIds(userIds: number[]): Promise<Array<UserAdmin>> {
    const stopWatching = this.logger.watch('users-findAllUsersByIds', {
      description: `Find All Users By Ids`,
      class: UsersAdminService.name,
      function: 'findAllUsersToken',
    });

    const queryBuilder = this.usersAdminRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.status', 'status')
      .orWhereInIds(userIds);
    const users = await queryBuilder.getMany();
    stopWatching();
    return users;
  }
}

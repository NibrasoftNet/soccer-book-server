import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { AddressService } from '../address/address.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './configs/users-pagination.config';
import { Status } from '../statuses/entities/status.entity';
import {
  runOnTransactionComplete,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional';
import { FilesService } from '../files/files.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { NullableType } from '../utils/types/nullable.type';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { plainToClass } from 'class-transformer';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly addressService: AddressService,
    private fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}
  @Transactional()
  async create(createProfileDto: CreateUserDto): Promise<User> {
    runOnTransactionRollback(() =>
      console.log(`Create User transaction rolled back`),
    );
    runOnTransactionComplete((error) => {
      if (!!error) {
        console.log(`Create User transaction failed`);
      }
      console.log(`Create User transaction completed`);
    });
    const user = this.usersRepository.create(createProfileDto);
    user.address = await this.addressService.create(createProfileDto.address);

    if (!createProfileDto.status) {
      user.status = plainToClass(Status, {
        id: StatusCodeEnum.INACTIVE,
        code: StatusCodeEnum.INACTIVE,
      });
    }
    return await this.usersRepository.save(user);
  }

  async findManyWithPagination(query: PaginateQuery): Promise<Paginated<User>> {
    return await paginate(query, this.usersRepository, usersPaginationConfig);
  }

  async findOne(fields: FindOptionsWhere<User>): Promise<NullableType<User>> {
    return await this.usersRepository.findOne({
      where: fields,
      relations: {
        address: true,
      },
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<User>,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: fields,
      relations,
    });
  }

  async update(
    id: string,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    const { address, ...filteredUserDto } = updateUserDto;
    if (!!address) {
      user.address = await this.addressService.update(
        user.address!.id,
        address,
      );
    }
    if (!!files) {
      user.photo = user?.photo?.id
        ? await this.fileService.updateFile(files, user?.photo?.path)
        : await this.fileService.uploadFile(files);
    }
    Object.assign(user, filteredUserDto);
    return this.usersRepository.save(user);
  }

  async softDelete(id: User['id']): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(id);
  }

  async restoreUserByEmail(email: User['email']): Promise<User | null> {
    // Find the user by email, including soft-deleted ones
    const user = await this.usersRepository.findOne({
      withDeleted: true,
      where: { email },
    });

    if (user && user.deletedAt) {
      // If the user is found and is soft-deleted, restore the user
      await this.usersRepository.restore(user.id);
      return user;
    }
    // Return null if no user was found or the user was not deleted
    return null;
  }

  async findAllUsersToken(userIds?: number[]): Promise<string[]> {
    const query = this.usersRepository
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

  async findAllUsersByIds(userIds: number[]): Promise<Array<User>> {
    const stopWatching = this.logger.watch('users-findAllUsersByIds', {
      description: `Find All Users By Ids`,
      class: UsersService.name,
      function: 'findAllUsersToken',
    });

    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.status', 'status')
      .orWhereInIds(userIds);
    const users = await queryBuilder.getMany();
    stopWatching();
    return users;
  }
}

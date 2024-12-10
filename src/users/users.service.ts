import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { AddressService } from '../address/address.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './configs/users-pagination.config';
import { FilesService } from '../files/files.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { NullableType } from '../utils/types/nullable.type';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { MulterFile } from 'fastify-file-interceptor';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly addressService: AddressService,
    private fileService: FilesService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const user = entityManager.create(
          User,
          createProfileDto as DeepPartial<User>,
        );
        if (createProfileDto.address) {
          user.address = await this.addressService.create(
            createProfileDto.address,
          );
        }
        return await entityManager.save(user);
      },
    );
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
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
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    const { address, ...filteredUserDto } = updateUserDto;
    if (!!address) {
      user.address = await this.addressService.update(user.address.id, address);
    }
    if (!!file) {
      user.photo = user?.photo?.id
        ? await this.fileService.updateFile(user?.photo?.id, file)
        : await this.fileService.uploadFile(file);
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

  async findAllUsersToken(): Promise<string[]> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select('array_agg(user.notificationsToken)', 'tokens') // Aggregate tokens into an array
      .where('user.notificationsToken IS NOT NULL')
      .getRawOne();

    if (!result.tokens || !result.tokens.length) {
      this.logger.debug('No notification receiver found');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            notification: 'No notification receiver found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return result.tokens as string[];
  }
}

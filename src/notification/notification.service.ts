import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Notification } from './entities/notification.entity';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { notificationsPaginationConfig } from './configs/notifications-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { UsersService } from '../users/users.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { WinstonLoggerService } from 'src/logger/winston-logger.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import {
  GraphileWorkerListener,
  OnWorkerEvent,
  WorkerService,
} from 'nestjs-graphile-worker';
import { WorkerEventMap } from 'graphile-worker';
import { NotificationJobPayload } from './interfaces/notification-job-payload';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import { CreateNotificationDto } from '@/domains/notification/dto/create-notification.dto';
import { NotificationMessageDto } from '@/domains/notification/dto/notification-message.dto';
import { UpdateNotificationDto } from '@/domains/notification/dto/update-notification.dto';

@Injectable()
@GraphileWorkerListener()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly logger: WinstonLoggerService,
    private readonly i18n: I18nService,
    private readonly graphileWorker: WorkerService,
  ) {}

  @OnWorkerEvent('job:success')
  async onJobSuccess({ job }: WorkerEventMap['job:success']) {
    this.logger.debug(`job #${job.id} finished`, job);
    this.logger.info(`job #${job.id} finished`, {
      data: job,
    });
    const payload = job.payload as NotificationJobPayload;
    if (job?.task_identifier === 'notification') {
      await this.update(payload.notificationId, {
        isNotificationSent: true,
      });
    }
  }

  @OnWorkerEvent('job:error')
  onJobError({ job, error }: WorkerEventMap['job:error']) {
    this.logger.error(`job #${job.id} fail ${JSON.stringify(error)}`);
  }

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    this.logger.info(`create-Notification`, {
      description: `Create a new Notification`,
      class: NotificationService.name,
      function: 'create',
    });

    const notification = this.notificationsRepository.create(
      createNotificationDto as DeepPartial<Notification>,
    );

    if (!notification.users.length) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            users: this.i18n.t('auth.userNotFound', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const savedNotification =
      await this.notificationsRepository.save(notification);

    if (
      savedNotification.typeOfSending !==
      NotificationTypeOfSendingEnum.PROGRAMMED
    ) {
      await this.sendPushNotifications(savedNotification.id);
    }
    return savedNotification;
  }

  async findAllPaginated(
    query: PaginateQuery,
  ): Promise<Paginated<Notification>> {
    this.logger.info(`find-All-Paginated-Notification`, {
      description: `find All Paginated Notification`,
      class: NotificationService.name,
      function: 'findAllPaginated',
    });
    return await paginate(
      query,
      this.notificationsRepository,
      notificationsPaginationConfig,
    );
  }

  async findAllByDay(): Promise<(Notification & { scheduled_date: Date })[]> {
    this.logger.info(`find-All-By-Day-Notification`, {
      description: `find All By Day Notification`,
      class: NotificationService.name,
      function: 'findAllByDay',
    });

    const currentDayOfWeek = new Date().getUTCDay(); // 0 (Sunday) to 6 (Saturday)

    return await this.notificationsRepository.query(
      `SELECT *
       FROM notification,
            unnest(notification.scheduled_notification) AS scheduled_date
       WHERE EXTRACT(DOW FROM scheduled_date) = $1
         AND notification.active = true`,
      [currentDayOfWeek],
    );
  }

  async findAllMyNotifications(
    user: JwtPayloadType,
    query: PaginateQuery,
  ): Promise<Paginated<Notification>> {
    const stopWatching = this.logger.watch(
      'notification-findAllMyNotifications',
      {
        description: `find All My Notifications`,
        class: NotificationService.name,
        function: 'findAllMyNotifications',
      },
    );

    const queryBuilder = this.notificationsRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.users', 'user')
      .where('notification.isNotificationSent = :isNotificationSent', {
        isNotificationSent: true,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('notification.forAllUsers = :forAll', {
            forAll: true,
          }).orWhere(
            new Brackets((subQb) => {
              subQb
                .where('notification.forAllUsers = :forAllFalse', {
                  forAllFalse: false,
                })
                .andWhere('user.id = :userId', { userId: user.id });
            }),
          );
        }),
      );
    const notifications = await paginate(
      query,
      queryBuilder,
      notificationsPaginationConfig,
    );
    stopWatching();
    return notifications;
  }

  async findOne(
    fields: FindOptionsWhere<Notification>,
    relations?: FindOptionsRelations<Notification> | string[],
  ): Promise<NullableType<Notification>> {
    this.logger.info(`find-one-Notifications`, {
      description: `find one Notifications`,
      class: NotificationService.name,
      function: 'findOne',
    });
    return await this.notificationsRepository.findOne({
      where: fields,
      relations: relations,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<Notification>,
    relations?: FindOptionsRelations<Notification> | string[],
  ): Promise<Notification> {
    this.logger.info(`find-one-Or-Fail-Notifications`, {
      description: `find one Or Fail Notifications`,
      class: NotificationService.name,
      function: 'findOneOrFail',
    });
    return await this.notificationsRepository.findOneOrFail({
      where: fields,
      relations: relations,
    });
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    this.logger.info(`update-Notification`, {
      description: `update Notification`,
      class: NotificationService.name,
      function: 'update',
    });
    const notification = await this.findOneOrFail({ id });
    Object.assign(notification, updateNotificationDto);

    return await this.notificationsRepository.save(notification);
  }

  async remove(id: string): Promise<DeleteResult> {
    this.logger.info(`remove-Notification`, {
      description: `remove Notification`,
      class: NotificationService.name,
      function: 'remove',
    });
    return await this.notificationsRepository.delete(id);
  }

  async sendPushNotifications(notificationId: string): Promise<void> {
    this.logger.info(`send-Push-Notification`, {
      description: `send Push Notifications`,
      class: NotificationService.name,
      function: 'sendPushNotifications',
    });
    const notification = await this.findOneOrFail(
      { id: notificationId },
      { users: true },
    );
    const message = await this.createNotificationMessage(notification);
    if (
      notification.typeOfSending === NotificationTypeOfSendingEnum.PUNCTUAL &&
      notification.punctualSendDate
    ) {
      await this.graphileWorker.addJob(
        'notification',
        {
          message: message,
          notificationId: notificationId,
        },
        {
          maxAttempts: 1,
          runAt: new Date(notification.punctualSendDate),
        },
      );
    } else {
      await this.graphileWorker.addJob(
        'notification',
        {
          message: message,
          notificationId: notificationId,
        },
        {
          maxAttempts: 1,
        },
      );
    }
  }

  async sendProgrammedNotifications(notificationId: string, sendAt: Date) {
    const notification = await this.findOneOrFail(
      { id: notificationId },
      { users: true },
    );
    const message = await this.createNotificationMessage(notification);

    await this.graphileWorker.addJob(
      'notification',
      {
        message: message,
        notificationId: notificationId,
      },
      {
        maxAttempts: 1,
        runAt: new Date(sendAt),
      },
    );
  }

  async createNotificationMessage(
    notification: Notification,
  ): Promise<NotificationMessageDto> {
    let tokens: string[] = [];

    if (!notification.forAllUsers) {
      tokens = notification.users.map(
        (item) => item.notificationsToken,
      ) as string[];
    } else if (notification.forAllUsers) {
      tokens = await this.usersService.findAllUsersToken();
    } else {
      this.logger.error('Error handling notifications:', notification);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: {
            notification: 'Wrong Notification configuration',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (tokens.length < 1) {
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

    return new NotificationMessageDto({
      notification: {
        title: notification.title,
        body: notification.message || 'default message',
      },
      data: {
        title: notification.title,
        message: notification.message || 'default message',
        notify_type: 'adminNotify',
      },
      tokens: tokens,
    });
  }
}

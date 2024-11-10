import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseIntPipe,
  Request,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionToTeamService } from './subscription-to-team.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { subscriptionToTeamPaginationConfig } from './config/subscription-to-team-pagination-config';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { SubscriptionToTeam } from './entities/subscription-to-team.entity';
import { SubscriptionToTeamDto } from '@/domains/subscription-to-team/subscription-to-team.dto';
import { UpdateSubscriptionToTeamDto } from '@/domains/subscription-to-team/update-subscription-to-team.dto';

@ApiBearerAuth()
@ApiTags('Subscription-to-team')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'subscription-to-team' })
export class SubscriptionToTeamController {
  constructor(
    private readonly subscriptionToTeamService: SubscriptionToTeamService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(SubscriptionToTeam, SubscriptionToTeamDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Post('teams/:teamId/users/:userId')
  async addMember(
    @Param('teamId', ParseIntPipe) teamId: string,
    @Param('userId', ParseIntPipe) userId: string,
  ): Promise<SubscriptionToTeam> {
    return await this.subscriptionToTeamService.addMember(teamId, userId);
  }

  @ApiPaginationQuery(subscriptionToTeamPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @Get()
  async findAll(@Paginate() query: PaginateQuery) {
    return await this.subscriptionToTeamService.findAll(query);
  }

  @ApiPaginationQuery(subscriptionToTeamPaginationConfig)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<SubscriptionToTeam, SubscriptionToTeamDto>> {
    const requestedDonations = await this.subscriptionToTeamService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<SubscriptionToTeam, SubscriptionToTeamDto>(
      this.mapper,
      requestedDonations,
      SubscriptionToTeam,
      SubscriptionToTeamDto,
    );
  }

  @UseInterceptors(MapInterceptor(SubscriptionToTeam, SubscriptionToTeamDto))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.subscriptionToTeamService.findOne(
      { id },
      { member: true },
    );
  }

  @Put(':id/users/:userId/unsubscribe')
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  async cancelMyRequest(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return await this.subscriptionToTeamService.cancelSubscription(id, userId);
  }

  @Put(':id')
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateApplicantToDonationDto: UpdateSubscriptionToTeamDto,
  ) {
    return await this.subscriptionToTeamService.update(
      id,
      updateApplicantToDonationDto,
    );
  }

  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.subscriptionToTeamService.remove(id);
  }
}

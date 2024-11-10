import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { teamPaginationConfig } from './config/team-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { CreateTeamDto } from '@/domains/team/create-team.dto';
import { FilesService } from '../files/files.service';
import { UpdateTeamDto } from '@/domains/team/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly usersService: UsersService,
    private readonly filesService: FilesService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    createTeamDto: CreateTeamDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<Team> {
    return await this.teamRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Create the team entity
        const team = this.teamRepository.create(
          createTeamDto as DeepPartial<Team>,
        );

        // Assign the creator to the team
        team.creator = await this.usersService.findOneOrFail({
          id: userJwtPayload.id,
        });

        // Upload the file and assign it as the team's logo
        if (file) {
          team.logo = await this.filesService.uploadFile(file);
        }
        // Save the team using the transaction manager
        return await entityManager.save(team);
      },
    );
  }

  async findAll(query: PaginateQuery) {
    return await paginate(query, this.teamRepository, teamPaginationConfig);
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, teamPaginationConfig);
  }

  async findAllOthers(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.creator', 'creator')
      .where('creator.id <> :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, teamPaginationConfig);
  }

  async findAllRequestedMe(
    userJwtPayload: JwtPayloadType,
    query: PaginateQuery,
  ) {
    const queryBuilder = this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.applicants', 'applicants')
      .leftJoinAndSelect('applicants.applicant', 'applicant')
      .where('applicant.id = :id', { id: userJwtPayload.id });

    return await paginate(query, queryBuilder, teamPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Team>,
    relations?: FindOptionsRelations<Team>,
  ): Promise<NullableType<Team>> {
    return await this.teamRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Team>,
    relations?: FindOptionsRelations<Team>,
  ): Promise<Team> {
    return await this.teamRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTeamDto: UpdateTeamDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ) {
    return await this.teamRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the team within the transaction
        const team = await this.findOneOrFail({ id });

        // Update the team with the new data
        Object.assign(team, updateTeamDto);

        // Handle file update or upload if a file is provided
        if (file) {
          team.logo = team.logo
            ? await this.filesService.updateFile(team.logo.id, file)
            : await this.filesService.uploadFile(file);
        }

        // Save the updated team entity within the transaction
        return await entityManager.save(team);
      },
    );
  }

  async remove(id: number) {
    return await this.teamRepository.delete(id);
  }
}

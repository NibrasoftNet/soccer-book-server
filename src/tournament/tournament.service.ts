import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { MulterFile } from 'fastify-file-interceptor';
import { FilesService } from '../files/files.service';
import { CreateTournamentDto } from '@/domains/tournament/create-tournament.dto';
import { UpdateTournamentDto } from '@/domains/tournament/update-tournament.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { tournamentPaginationConfig } from './config/tournament-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { ComplexService } from '../complex/complex.service';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly complexService: ComplexService,
    private readonly fileService: FilesService,
  ) {}
  async create(
    complexId: string,
    createTournamentDto: CreateTournamentDto,
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<Tournament> {
    const tournament = this.tournamentRepository.create(
      createTournamentDto as DeepPartial<Tournament>,
    );
    tournament.complex = await this.complexService.findOneOrFail({
      id: complexId,
    });
    if (!!file) {
      tournament.image = await this.fileService.uploadFile(file);
    }
    return await this.tournamentRepository.save(tournament);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Tournament>> {
    return await paginate<Tournament>(
      query,
      this.tournamentRepository,
      tournamentPaginationConfig,
    );
  }

  async findOne(
    fields: FindOptionsWhere<Tournament>,
    relations?: FindOptionsRelations<Tournament>,
  ): Promise<NullableType<Tournament>> {
    return await this.tournamentRepository.findOne({
      where: fields,
      relations,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<Tournament>,
    relations?: FindOptionsRelations<Tournament>,
  ): Promise<Tournament> {
    return await this.tournamentRepository.findOneOrFail({
      where: fields,
      relations,
    });
  }

  async update(
    id: string,
    updateTournamentDto: UpdateTournamentDto,
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<Tournament> {
    const tournament = await this.findOneOrFail({ id });
    Object.assign(tournament, updateTournamentDto);
    if (!!file) {
      tournament.image = tournament.image?.id
        ? await this.fileService.updateFile(tournament.image?.id, file)
        : await this.fileService.uploadFile(file);
    }
    if (updateTournamentDto.complexId) {
      tournament.complex = await this.complexService.findOneOrFail({
        id: updateTournamentDto.complexId,
      });
    }
    return await this.tournamentRepository.save(tournament);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tournamentRepository.delete(id);
  }
}

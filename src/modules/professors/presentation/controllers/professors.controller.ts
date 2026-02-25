// modules/professors/presentation/controllers/professors.controller.ts

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateProfessorUseCase,
  ListProfessorsUseCase,
} from '@professors/application/use-cases';
import { CreateProfessorCommand } from '@professors/application/commands';
import { PROFESSOR_ROUTES } from '../constants';
import { ApiCreateProfessor, ApiListProfessors } from '../decorators';
import { ProfessorHttpMapper } from '../mappers';
import { CreateProfessorDto, ProfessorResponseDto } from '../dtos';

@ApiTags('professors')
@Controller(PROFESSOR_ROUTES.BASE)
export class ProfessorsController {
  constructor(
    private readonly createUseCase: CreateProfessorUseCase,
    private readonly listUseCase: ListProfessorsUseCase,
  ) {}

  @Post(PROFESSOR_ROUTES.CREATE)
  @ApiCreateProfessor()
  async create(@Body() dto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    const professor = await this.createUseCase.execute(
      new CreateProfessorCommand(dto),
    );
    return ProfessorHttpMapper.toResponse(professor);
  }

  @Get(PROFESSOR_ROUTES.LIST)
  @ApiListProfessors()
  @ApiPaginatedResponse()
  async list(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<PaginatedResultDto<ProfessorResponseDto>> {
    const pagination = new PaginationVO(page, pageSize);
    const result = await this.listUseCase.execute(pagination);
    return ProfessorHttpMapper.toPaginatedResponse(result, pagination);
  }
}

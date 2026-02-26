// modules/professors/presentation/controllers/professors.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateProfessorUseCase,
  ListProfessorsUseCase,
  GetProfessorByIdUseCase,
} from '@professors/application/use-cases';
import { CreateProfessorCommand } from '@professors/application/commands';
import { PROFESSOR_ROUTES } from '../constants';
import {
  ApiCreateProfessor,
  ApiListProfessors,
  ApiGetProfessorById,
} from '../decorators';
import { CreateProfessorDto, ProfessorResponseDto } from '../dtos';
import { ProfessorHttpMapper } from '../mappers';

@ApiTags('professors')
@Controller(PROFESSOR_ROUTES.BASE)
export class ProfessorsController {
  constructor(
    private readonly createUseCase: CreateProfessorUseCase,
    private readonly listUseCase: ListProfessorsUseCase,
    private readonly getByIdUseCase: GetProfessorByIdUseCase,
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
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ): Promise<PaginatedResultDto<ProfessorResponseDto>> {
    const pagination = new PaginationVO(page, pageSize);
    const result = await this.listUseCase.execute(pagination);
    return ProfessorHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(PROFESSOR_ROUTES.GET_BY_ID)
  @ApiGetProfessorById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProfessorResponseDto> {
    const professor = await this.getByIdUseCase.execute(id);
    return ProfessorHttpMapper.toResponse(professor);
  }
}

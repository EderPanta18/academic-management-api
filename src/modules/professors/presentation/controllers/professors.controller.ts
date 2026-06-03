// modules/professors/presentation/controllers/professors.controller.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfessorCommand } from '@professors/application/commands';
import { ListProfessorsQuery } from '@professors/application/queries';
import {
  CreateProfessorUseCase,
  GetProfessorByIdUseCase,
  ListProfessorsUseCase,
} from '@professors/application/use-cases';
import { PROFESSOR_ROUTES, PROFESSOR_SWAGGER_TAG } from '../constants';
import { ApiCreateProfessor, ApiGetProfessorById, ApiListProfessors } from '../decorators';
import { CreateProfessorDto, ListProfessorsQueryDto, ProfessorResponseDto } from '../dtos';
import { ProfessorHttpMapper } from '../mappers';

@ApiTags(PROFESSOR_SWAGGER_TAG.name)
@Controller(PROFESSOR_ROUTES.BASE)
export class ProfessorsController {
  constructor(
    private readonly createUseCase: CreateProfessorUseCase,
    private readonly listUseCase: ListProfessorsUseCase,
    private readonly getByIdUseCase: GetProfessorByIdUseCase,
  ) {}

  @Post()
  @ApiCreateProfessor()
  async create(@Body() dto: CreateProfessorDto): Promise<ProfessorResponseDto> {
    const command = new CreateProfessorCommand(dto);
    const professor = await this.createUseCase.execute(command);

    return ProfessorHttpMapper.toResponseFromCreate(professor, command);
  }

  @Get(PROFESSOR_ROUTES.GET_BY_ID)
  @ApiGetProfessorById()
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ProfessorResponseDto> {
    const professor = await this.getByIdUseCase.execute(id);

    return ProfessorHttpMapper.toResponse(professor);
  }

  @Get()
  @ApiListProfessors()
  async list(
    @Query() queryDto: ListProfessorsQueryDto,
  ): Promise<PaginatedResultDto<ProfessorResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = new ListProfessorsQuery(queryDto);
    const result = await this.listUseCase.execute(pagination, query);

    return ProfessorHttpMapper.toPaginatedResponse(result, pagination);
  }
}

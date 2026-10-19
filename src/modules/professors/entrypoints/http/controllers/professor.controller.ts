import { type PaginatedResult, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateProfessorUseCase,
  GetProfessorByIdUseCase,
  ListProfessorsUseCase,
} from '@professors/application/use-cases';
import { ApiCreateProfessor, ApiGetProfessorById, ApiListProfessors } from '../decorators';
import {
  CreateProfessorRequestDto,
  ListProfessorsQueryDto,
  ProfessorReadModelResponseDto,
  ProfessorResponseDto,
} from '../dtos';
import { ProfessorRequestMapper, ProfessorResponseMapper } from '../mappers';
import { PROFESSOR_ROUTES, PROFESSOR_SWAGGER_TAG } from './professor-routes.constants';

@ApiTags(PROFESSOR_SWAGGER_TAG.name)
@Controller(PROFESSOR_ROUTES.BASE)
export class ProfessorsController {
  constructor(
    private readonly listUseCase: ListProfessorsUseCase,
    private readonly getByIdUseCase: GetProfessorByIdUseCase,
    private readonly createUseCase: CreateProfessorUseCase,
  ) {}

  @Get()
  @ApiListProfessors()
  async list(
    @Query() queryDto: ListProfessorsQueryDto,
  ): Promise<PaginatedResult<ProfessorReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = ProfessorRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return ProfessorResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(PROFESSOR_ROUTES.GET_BY_ID)
  @ApiGetProfessorById()
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<ProfessorReadModelResponseDto> {
    const model = await this.getByIdUseCase.execute(id);

    return ProfessorResponseMapper.toReadModelResponse(model);
  }

  @Post()
  @ApiCreateProfessor()
  async create(@Body() dto: CreateProfessorRequestDto): Promise<ProfessorResponseDto> {
    const command = ProfessorRequestMapper.toCreateCommand(dto);
    const professor = await this.createUseCase.execute(command);

    return ProfessorResponseMapper.toResponse(professor);
  }
}

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
import { PaginationVO, PaginatedResultDto } from '@core/pagination';
import { SWAGGER_TAGS } from '@platform/http/swagger';
import {
  CreateProfessorUseCase,
  ListProfessorsUseCase,
  GetProfessorByIdUseCase,
} from '@professors/application/use-cases';
import { CreateProfessorCommand } from '@professors/application/commands';
import { ListProfessorsQuery } from '@professors/application/queries';
import { PROFESSOR_ROUTES } from '../constants';
import {
  ApiCreateProfessor,
  ApiListProfessors,
  ApiGetProfessorById,
} from '../decorators';
import {
  CreateProfessorDto,
  ListProfessorsQueryDto,
  ProfessorResponseDto,
} from '../dtos';
import { ProfessorHttpMapper } from '../mappers';

@ApiTags(SWAGGER_TAGS.PROFESSORS)
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
    const command = new CreateProfessorCommand(dto);
    const professor = await this.createUseCase.execute(command);
    return ProfessorHttpMapper.toResponseFromCreate(professor, command);
  }

  @Get(PROFESSOR_ROUTES.LIST)
  @ApiListProfessors()
  async list(
    @Query() queryDto: ListProfessorsQueryDto,
  ): Promise<PaginatedResultDto<ProfessorResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);
    const query = queryDto.departmentId
      ? new ListProfessorsQuery({ departmentId: queryDto.departmentId })
      : undefined;

    const result = await this.listUseCase.execute(pagination, query);
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

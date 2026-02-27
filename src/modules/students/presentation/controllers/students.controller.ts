// modules/students/presentation/controllers/students.controller.ts

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
import { PaginationQueryDto } from '@shared/presentation/dtos';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateStudentUseCase,
  ListStudentsUseCase,
  GetStudentByIdUseCase,
} from '@students/application/use-cases';
import { CreateStudentCommand } from '@students/application/commands';
import { STUDENT_ROUTES } from '../constants';
import {
  ApiCreateStudent,
  ApiListStudents,
  ApiGetStudentById,
} from '../decorators';
import { CreateStudentDto, StudentResponseDto } from '../dtos';
import { StudentHttpMapper } from '../mappers';

@ApiTags('students')
@Controller(STUDENT_ROUTES.BASE)
export class StudentsController {
  constructor(
    private readonly createUseCase: CreateStudentUseCase,
    private readonly getByIdUseCase: GetStudentByIdUseCase,
    private readonly listUseCase: ListStudentsUseCase,
  ) {}

  @Post(STUDENT_ROUTES.CREATE)
  @ApiCreateStudent()
  async create(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    const student = await this.createUseCase.execute(
      new CreateStudentCommand(dto),
    );
    return StudentHttpMapper.toResponse(student);
  }

  @Get(STUDENT_ROUTES.LIST)
  @ApiListStudents()
  @ApiPaginatedResponse()
  async list(
    @Query() queryDto: PaginationQueryDto,
  ): Promise<PaginatedResultDto<StudentResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);
    const result = await this.listUseCase.execute(pagination);
    return StudentHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(STUDENT_ROUTES.GET_BY_ID)
  @ApiGetStudentById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StudentResponseDto> {
    const student = await this.getByIdUseCase.execute(id);
    return StudentHttpMapper.toResponse(student);
  }
}

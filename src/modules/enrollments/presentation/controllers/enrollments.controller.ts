// modules/enrollments/presentation/controllers/enrollments.controller.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import { EnrollStudentCommand } from '@enrollments/application/commands';
import { ListEnrollmentsQuery } from '@enrollments/application/queries';
import {
  EnrollStudentUseCase,
  GetEnrollmentByIdUseCase,
  ListEnrollmentsUseCase,
} from '@enrollments/application/use-cases';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ENROLLMENT_ROUTES, ENROLLMENT_SWAGGER_TAG } from '../constants';
import { ApiEnrollStudent, ApiGetEnrollmentById, ApiListEnrollments } from '../decorators';
import { EnrollmentResponseDto, EnrollStudentDto, ListEnrollmentsQueryDto } from '../dtos';
import { EnrollmentHttpMapper } from '../mappers';

@ApiTags(ENROLLMENT_SWAGGER_TAG.name)
@Controller(ENROLLMENT_ROUTES.BASE)
export class EnrollmentsController {
  constructor(
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly getByIdUseCase: GetEnrollmentByIdUseCase,
    private readonly listUseCase: ListEnrollmentsUseCase,
  ) {}

  @Post()
  @ApiEnrollStudent()
  async enroll(@Body() dto: EnrollStudentDto): Promise<EnrollmentResponseDto> {
    const command = new EnrollStudentCommand(dto);
    const enrollment = await this.enrollStudentUseCase.execute(command);

    return EnrollmentHttpMapper.toResponse(enrollment);
  }

  @Get(ENROLLMENT_ROUTES.GET_BY_ID)
  @ApiGetEnrollmentById()
  async getById(@Param('id', ParseIntPipe) id: number): Promise<EnrollmentResponseDto> {
    const enrollment = await this.getByIdUseCase.execute(id);

    return EnrollmentHttpMapper.toResponse(enrollment);
  }

  @Get()
  @ApiListEnrollments()
  async list(
    @Query() queryDto: ListEnrollmentsQueryDto,
  ): Promise<PaginatedResultDto<EnrollmentResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = new ListEnrollmentsQuery(queryDto);
    const result = await this.listUseCase.execute(pagination, query);

    return EnrollmentHttpMapper.toPaginatedResponse(result, pagination);
  }
}

// modules/enrollments/presentation/controllers/enrollments.controller.ts

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
  EnrollStudentUseCase,
  ListEnrollmentsUseCase,
  GetEnrollmentByIdUseCase,
} from '@enrollments/application/use-cases';
import { EnrollStudentCommand } from '@enrollments/application/commands';
import { ListEnrollmentsQuery } from '@enrollments/application/queries';
import { ENROLLMENT_ROUTES } from '../constants';
import {
  ApiEnrollStudent,
  ApiGetEnrollmentById,
  ApiListEnrollments,
} from '../decorators';
import {
  EnrollStudentDto,
  EnrollmentResponseDto,
  ListEnrollmentsQueryDto,
} from '../dtos';
import { EnrollmentHttpMapper } from '../mappers';

@ApiTags(SWAGGER_TAGS.ENROLLMENTS)
@Controller(ENROLLMENT_ROUTES.BASE)
export class EnrollmentsController {
  constructor(
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly getByIdUseCase: GetEnrollmentByIdUseCase,
    private readonly listUseCase: ListEnrollmentsUseCase,
  ) {}

  @Post(ENROLLMENT_ROUTES.CREATE)
  @ApiEnrollStudent()
  async enroll(@Body() dto: EnrollStudentDto): Promise<EnrollmentResponseDto> {
    const enrollment = await this.enrollStudentUseCase.execute(
      new EnrollStudentCommand(dto),
    );
    return EnrollmentHttpMapper.toResponse(enrollment);
  }

  @Get(ENROLLMENT_ROUTES.LIST)
  @ApiListEnrollments()
  async list(
    @Query() queryDto: ListEnrollmentsQueryDto,
  ): Promise<PaginatedResultDto<EnrollmentResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);
    const query =
      queryDto.studentId || queryDto.courseOfferingId || queryDto.status?.length
        ? new ListEnrollmentsQuery({
            studentId: queryDto.studentId,
            courseOfferingId: queryDto.courseOfferingId,
            statuses: queryDto.status,
          })
        : undefined;

    const result = await this.listUseCase.execute(pagination, query);
    return EnrollmentHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(ENROLLMENT_ROUTES.GET_BY_ID)
  @ApiGetEnrollmentById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EnrollmentResponseDto> {
    const enrollment = await this.getByIdUseCase.execute(id);
    return EnrollmentHttpMapper.toResponse(enrollment);
  }
}

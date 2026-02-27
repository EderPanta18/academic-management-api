// modules/course-offerings/presentation/controllers/course-offerings.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationVO } from '@shared/domain/value-objects';
import { PaginatedResultDto } from '@shared/application/dtos';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateCourseOfferingUseCase,
  ActivateCourseOfferingUseCase,
  AssignProfessorToOfferingUseCase,
  GetCourseOfferingByIdUseCase,
  ListCourseOfferingsUseCase,
} from '@course-offerings/application/use-cases';
import {
  CreateCourseOfferingCommand,
  AssignProfessorToOfferingCommand,
} from '@course-offerings/application/commands';
import { ListCourseOfferingsQuery } from '@course-offerings/application/queries';
import { COURSE_OFFERING_ROUTES } from '../constants';
import {
  ApiActivateCourseOffering,
  ApiAssignProfessorToOffering,
  ApiCreateCourseOffering,
  ApiGetCourseOfferingById,
  ApiListCourseOfferings,
} from '../decorators';
import {
  AssignProfessorDto,
  CourseOfferingResponseDto,
  CreateCourseOfferingDto,
  ListCourseOfferingsQueryDto,
} from '../dtos';
import { CourseOfferingHttpMapper } from '../mappers';

@ApiTags('course-offerings')
@Controller(COURSE_OFFERING_ROUTES.BASE)
export class CourseOfferingsController {
  constructor(
    private readonly createUseCase: CreateCourseOfferingUseCase,
    private readonly activateUseCase: ActivateCourseOfferingUseCase,
    private readonly assignProfessorUseCase: AssignProfessorToOfferingUseCase,
    private readonly getByIdUseCase: GetCourseOfferingByIdUseCase,
    private readonly listUseCase: ListCourseOfferingsUseCase,
  ) {}

  @Post(COURSE_OFFERING_ROUTES.CREATE)
  @ApiCreateCourseOffering()
  async create(
    @Body() dto: CreateCourseOfferingDto,
  ): Promise<CourseOfferingResponseDto> {
    const offering = await this.createUseCase.execute(
      new CreateCourseOfferingCommand(dto),
    );
    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Get(COURSE_OFFERING_ROUTES.LIST)
  @ApiListCourseOfferings()
  @ApiPaginatedResponse()
  async list(
    @Query() queryDto: ListCourseOfferingsQueryDto,
  ): Promise<PaginatedResultDto<CourseOfferingResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = queryDto.status?.length
      ? new ListCourseOfferingsQuery({ status: queryDto.status })
      : undefined;

    const result = await this.listUseCase.execute(pagination, query);

    return CourseOfferingHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(COURSE_OFFERING_ROUTES.GET_BY_ID)
  @ApiGetCourseOfferingById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseOfferingResponseDto> {
    const offering = await this.getByIdUseCase.execute(id);
    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Patch(COURSE_OFFERING_ROUTES.ASSIGN_PROFESSOR)
  @ApiAssignProfessorToOffering()
  async assignProfessor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProfessorDto,
  ): Promise<CourseOfferingResponseDto> {
    const offering = await this.assignProfessorUseCase.execute(
      new AssignProfessorToOfferingCommand({
        offeringId: id,
        professorId: dto.professorId,
      }),
    );
    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Patch(COURSE_OFFERING_ROUTES.ACTIVATE)
  @ApiActivateCourseOffering()
  async activate(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseOfferingResponseDto> {
    const offering = await this.activateUseCase.execute(id);
    return CourseOfferingHttpMapper.toResponse(offering);
  }
}

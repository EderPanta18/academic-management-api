// modules/course-offerings/presentation/controllers/course-offerings.controller.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import {
  AssignProfessorToOfferingCommand,
  CreateCourseOfferingCommand,
} from '@course-offerings/application/commands';
import { ListCourseOfferingsQuery } from '@course-offerings/application/queries';
import {
  ActivateCourseOfferingUseCase,
  AssignProfessorToOfferingUseCase,
  CreateCourseOfferingUseCase,
  GetCourseOfferingByIdUseCase,
  ListCourseOfferingsUseCase,
} from '@course-offerings/application/use-cases';
import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COURSE_OFFERING_ROUTES, COURSE_OFFERING_SWAGGER_TAG } from '../constants';
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

@ApiTags(COURSE_OFFERING_SWAGGER_TAG.name)
@Controller(COURSE_OFFERING_ROUTES.BASE)
export class CourseOfferingsController {
  constructor(
    private readonly createUseCase: CreateCourseOfferingUseCase,
    private readonly activateUseCase: ActivateCourseOfferingUseCase,
    private readonly assignProfessorUseCase: AssignProfessorToOfferingUseCase,
    private readonly getByIdUseCase: GetCourseOfferingByIdUseCase,
    private readonly listUseCase: ListCourseOfferingsUseCase,
  ) {}

  @Post()
  @ApiCreateCourseOffering()
  async create(@Body() dto: CreateCourseOfferingDto): Promise<CourseOfferingResponseDto> {
    const command = new CreateCourseOfferingCommand(dto);
    const offering = await this.createUseCase.execute(command);

    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Get(COURSE_OFFERING_ROUTES.GET_BY_ID)
  @ApiGetCourseOfferingById()
  async getById(@Param('id', ParseIntPipe) id: number): Promise<CourseOfferingResponseDto> {
    const offering = await this.getByIdUseCase.execute(id);

    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Get()
  @ApiListCourseOfferings()
  async list(
    @Query() queryDto: ListCourseOfferingsQueryDto,
  ): Promise<PaginatedResultDto<CourseOfferingResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = new ListCourseOfferingsQuery(queryDto);
    const result = await this.listUseCase.execute(pagination, query);

    return CourseOfferingHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Patch(COURSE_OFFERING_ROUTES.ASSIGN_PROFESSOR)
  @ApiAssignProfessorToOffering()
  async assignProfessor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProfessorDto,
  ): Promise<CourseOfferingResponseDto> {
    const command = new AssignProfessorToOfferingCommand({
      offeringId: id,
      professorId: dto.professorId,
    });

    const offering = await this.assignProfessorUseCase.execute(command);

    return CourseOfferingHttpMapper.toResponse(offering);
  }

  @Patch(COURSE_OFFERING_ROUTES.ACTIVATE)
  @ApiActivateCourseOffering()
  async activate(@Param('id', ParseIntPipe) id: number): Promise<CourseOfferingResponseDto> {
    const offering = await this.activateUseCase.execute(id);

    return CourseOfferingHttpMapper.toResponse(offering);
  }
}

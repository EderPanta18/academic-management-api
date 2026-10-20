import { type PaginatedResult, PaginationVO } from '@core/pagination';
import {
  AssignProfessorToOfferingUseCase,
  CancelCourseOfferingUseCase,
  CloseCourseOfferingUseCase,
  CreateCourseOfferingUseCase,
  FinishCourseOfferingUseCase,
  GetCourseOfferingByIdUseCase,
  ListCourseOfferingsUseCase,
  OpenCourseOfferingUseCase,
} from '@course-offerings/application/use-cases';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiAssignProfessorToOffering,
  ApiCancelCourseOffering,
  ApiCloseCourseOffering,
  ApiCreateCourseOffering,
  ApiFinishCourseOffering,
  ApiGetCourseOfferingById,
  ApiListCourseOfferings,
  ApiOpenCourseOffering,
} from '../decorators';
import {
  AssignProfessorRequestDto,
  CourseOfferingReadModelResponseDto,
  CourseOfferingResponseDto,
  CreateCourseOfferingRequestDto,
  ListCourseOfferingsQueryDto,
} from '../dtos';
import { CourseOfferingRequestMapper, CourseOfferingResponseMapper } from '../mappers';
import {
  COURSE_OFFERING_ROUTES,
  COURSE_OFFERING_SWAGGER_TAG,
} from './course-offering-routes.constants';

@ApiTags(COURSE_OFFERING_SWAGGER_TAG.name)
@Controller(COURSE_OFFERING_ROUTES.BASE)
export class CourseOfferingsController {
  constructor(
    private readonly listUseCase: ListCourseOfferingsUseCase,
    private readonly getByIdUseCase: GetCourseOfferingByIdUseCase,
    private readonly createUseCase: CreateCourseOfferingUseCase,
    private readonly assignProfessorUseCase: AssignProfessorToOfferingUseCase,
    private readonly openUseCase: OpenCourseOfferingUseCase,
    private readonly closeUseCase: CloseCourseOfferingUseCase,
    private readonly finishUseCase: FinishCourseOfferingUseCase,
    private readonly cancelUseCase: CancelCourseOfferingUseCase,
  ) {}

  @Get()
  @ApiListCourseOfferings()
  async list(
    @Query() queryDto: ListCourseOfferingsQueryDto,
  ): Promise<PaginatedResult<CourseOfferingReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = CourseOfferingRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return CourseOfferingResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(COURSE_OFFERING_ROUTES.GET_BY_ID)
  @ApiGetCourseOfferingById()
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CourseOfferingReadModelResponseDto> {
    const readModel = await this.getByIdUseCase.execute(id);

    return CourseOfferingResponseMapper.toReadModelResponse(readModel);
  }

  @Post()
  @ApiCreateCourseOffering()
  async create(@Body() dto: CreateCourseOfferingRequestDto): Promise<CourseOfferingResponseDto> {
    const command = CourseOfferingRequestMapper.toCreateCommand(dto);
    const courseOffering = await this.createUseCase.execute(command);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }

  @Patch(COURSE_OFFERING_ROUTES.ASSIGN_PROFESSOR)
  @ApiAssignProfessorToOffering()
  async assignProfessor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignProfessorRequestDto,
  ): Promise<CourseOfferingResponseDto> {
    const command = CourseOfferingRequestMapper.toAssignProfessorCommand(id, dto);
    const courseOffering = await this.assignProfessorUseCase.execute(command);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }

  @Patch(COURSE_OFFERING_ROUTES.OPEN)
  @ApiOpenCourseOffering()
  async open(@Param('id', ParseUUIDPipe) id: string): Promise<CourseOfferingResponseDto> {
    const courseOffering = await this.openUseCase.execute(id);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }

  @Patch(COURSE_OFFERING_ROUTES.CLOSE)
  @ApiCloseCourseOffering()
  async close(@Param('id', ParseUUIDPipe) id: string): Promise<CourseOfferingResponseDto> {
    const courseOffering = await this.closeUseCase.execute(id);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }

  @Patch(COURSE_OFFERING_ROUTES.FINISH)
  @ApiFinishCourseOffering()
  async finish(@Param('id', ParseUUIDPipe) id: string): Promise<CourseOfferingResponseDto> {
    const courseOffering = await this.finishUseCase.execute(id);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }

  @Patch(COURSE_OFFERING_ROUTES.CANCEL)
  @ApiCancelCourseOffering()
  async cancel(@Param('id', ParseUUIDPipe) id: string): Promise<CourseOfferingResponseDto> {
    const courseOffering = await this.cancelUseCase.execute(id);

    return CourseOfferingResponseMapper.toResponse(courseOffering);
  }
}

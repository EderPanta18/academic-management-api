import { type PaginatedResult, PaginationVO } from '@core/pagination';
import {
  CreateCourseUseCase,
  GetCourseByIdUseCase,
  ListCoursesUseCase,
} from '@courses/application/use-cases';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiCreateCourse, ApiGetCourseById, ApiListCourses } from '../decorators';
import {
  CourseReadModelResponseDto,
  CourseResponseDto,
  CreateCourseRequestDto,
  ListCoursesQueryDto,
} from '../dtos';
import { CourseRequestMapper, CourseResponseMapper } from '../mappers';
import { COURSE_ROUTES, COURSE_SWAGGER_TAG } from './course-routes.constants';

@ApiTags(COURSE_SWAGGER_TAG.name)
@Controller(COURSE_ROUTES.BASE)
export class CoursesController {
  constructor(
    private readonly listUseCase: ListCoursesUseCase,
    private readonly getByIdUseCase: GetCourseByIdUseCase,
    private readonly createUseCase: CreateCourseUseCase,
  ) {}

  @Get()
  @ApiListCourses()
  async list(
    @Query() queryDto: ListCoursesQueryDto,
  ): Promise<PaginatedResult<CourseReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = CourseRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return CourseResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(COURSE_ROUTES.GET_BY_ID)
  @ApiGetCourseById()
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<CourseReadModelResponseDto> {
    const readModel = await this.getByIdUseCase.execute(id);

    return CourseResponseMapper.toReadModelResponse(readModel);
  }

  @Post()
  @ApiCreateCourse()
  async create(@Body() dto: CreateCourseRequestDto): Promise<CourseResponseDto> {
    const command = CourseRequestMapper.toCreateCommand(dto);
    const course = await this.createUseCase.execute(command);

    return CourseResponseMapper.toResponse(course);
  }
}

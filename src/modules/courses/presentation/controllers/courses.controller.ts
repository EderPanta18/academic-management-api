// modules/courses/presentation/controllers/courses.controller.ts

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
import { SWAGGER_TAGS } from '@shared/presentation/constants';
import { ApiPaginatedResponse } from '@shared/presentation/decorators';
import {
  CreateCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase,
} from '@courses/application/use-cases';
import { CreateCourseCommand } from '@courses/application/commands';
import { ListCoursesQuery } from '@courses/application/queries';
import { COURSE_ROUTES } from '../constants';
import {
  ApiCreateCourse,
  ApiListCourses,
  ApiGetCourseById,
} from '../decorators';
import {
  CreateCourseDto,
  CourseResponseDto,
  ListCoursesQueryDto,
} from '../dtos';
import { CourseHttpMapper } from '../mappers';

@ApiTags(SWAGGER_TAGS.COURSES)
@Controller(COURSE_ROUTES.BASE)
export class CoursesController {
  constructor(
    private readonly createUseCase: CreateCourseUseCase,
    private readonly listUseCase: ListCoursesUseCase,
    private readonly getByIdUseCase: GetCourseByIdUseCase,
  ) {}

  @Post(COURSE_ROUTES.CREATE)
  @ApiCreateCourse()
  async create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    const course = await this.createUseCase.execute(
      new CreateCourseCommand({
        careerId: dto.careerId,
        name: dto.name,
        credits: dto.credits,
        categoryId: dto.categoryId,
        description: dto.description,
      }),
    );

    return CourseHttpMapper.toResponse(course);
  }

  @Get(COURSE_ROUTES.LIST)
  @ApiListCourses()
  @ApiPaginatedResponse()
  async list(
    @Query() queryDto: ListCoursesQueryDto,
  ): Promise<PaginatedResultDto<CourseResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);
    const query =
      queryDto.careerId || queryDto.categoryId
        ? new ListCoursesQuery({
            careerId: queryDto.careerId,
            categoryId: queryDto.categoryId,
          })
        : undefined;

    const result = await this.listUseCase.execute(pagination, query);
    return CourseHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Get(COURSE_ROUTES.GET_BY_ID)
  @ApiGetCourseById()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CourseResponseDto> {
    const course = await this.getByIdUseCase.execute(id);
    return CourseHttpMapper.toResponse(course);
  }
}

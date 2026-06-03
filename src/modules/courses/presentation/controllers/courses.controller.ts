// modules/courses/presentation/controllers/courses.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PaginationVO, PaginatedResultDto } from "@core/pagination";
import { CreateCourseCommand } from "@courses/application/commands";
import { ListCoursesQuery } from "@courses/application/queries";
import {
  CreateCourseUseCase,
  ListCoursesUseCase,
  GetCourseByIdUseCase
} from "@courses/application/use-cases";
import { COURSE_ROUTES, COURSE_SWAGGER_TAG } from "../constants";
import {
  ApiCreateCourse,
  ApiGetCourseById,
  ApiListCourses
} from "../decorators";
import {
  CreateCourseDto,
  CourseResponseDto,
  ListCoursesQueryDto
} from "../dtos";
import { CourseHttpMapper } from "../mappers";

@ApiTags(COURSE_SWAGGER_TAG.name)
@Controller(COURSE_ROUTES.BASE)
export class CoursesController {
  constructor(
    private readonly createUseCase: CreateCourseUseCase,
    private readonly listUseCase: ListCoursesUseCase,
    private readonly getByIdUseCase: GetCourseByIdUseCase
  ) {}

  @Post()
  @ApiCreateCourse()
  async create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    const command = new CreateCourseCommand(dto);

    const course = await this.createUseCase.execute(command);

    return CourseHttpMapper.toResponse(course);
  }

  @Get(COURSE_ROUTES.GET_BY_ID)
  @ApiGetCourseById()
  async getById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<CourseResponseDto> {
    const course = await this.getByIdUseCase.execute(id);

    return CourseHttpMapper.toResponse(course);
  }

  @Get()
  @ApiListCourses()
  async list(
    @Query() queryDto: ListCoursesQueryDto
  ): Promise<PaginatedResultDto<CourseResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = new ListCoursesQuery(queryDto);
    const result = await this.listUseCase.execute(pagination, query);

    return CourseHttpMapper.toPaginatedResponse(result, pagination);
  }
}

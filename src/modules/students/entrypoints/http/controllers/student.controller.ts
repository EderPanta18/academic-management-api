import { type PaginatedResult, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateStudentUseCase,
  GetStudentByIdUseCase,
  ListStudentsUseCase,
} from '@students/application/use-cases';
import { ApiCreateStudent, ApiGetStudentById, ApiListStudents } from '../decorators';
import {
  CreateStudentRequestDto,
  ListStudentsQueryDto,
  StudentReadModelResponseDto,
  StudentResponseDto,
} from '../dtos';
import { StudentRequestMapper, StudentResponseMapper } from '../mappers';
import { STUDENT_ROUTES, STUDENT_SWAGGER_TAG } from './student-routes.constants';

@ApiTags(STUDENT_SWAGGER_TAG.name)
@Controller(STUDENT_ROUTES.BASE)
export class StudentsController {
  constructor(
    private readonly listUseCase: ListStudentsUseCase,
    private readonly getByIdUseCase: GetStudentByIdUseCase,
    private readonly createUseCase: CreateStudentUseCase,
  ) {}

  @Get()
  @ApiListStudents()
  async list(
    @Query() queryDto: ListStudentsQueryDto,
  ): Promise<PaginatedResult<StudentReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = StudentRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return StudentResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(STUDENT_ROUTES.GET_BY_ID)
  @ApiGetStudentById()
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<StudentReadModelResponseDto> {
    const model = await this.getByIdUseCase.execute(id);

    return StudentResponseMapper.toReadModelResponse(model);
  }

  @Post()
  @ApiCreateStudent()
  async create(@Body() dto: CreateStudentRequestDto): Promise<StudentResponseDto> {
    const command = StudentRequestMapper.toCreateCommand(dto);
    const student = await this.createUseCase.execute(command);

    return StudentResponseMapper.toResponse(student);
  }
}

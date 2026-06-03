// modules/students/presentation/controllers/students.controller.ts

import { PaginatedResultDto, PaginationVO } from '@core/pagination';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { BulkImportStudentsCommand, CreateStudentCommand } from '@students/application/commands';
import { ListStudentsQuery } from '@students/application/queries';
import {
  BulkImportStudentsUseCase,
  CreateStudentUseCase,
  GetStudentByIdUseCase,
  ListStudentsUseCase,
} from '@students/application/use-cases';
import { memoryStorage } from 'multer';
import { STUDENT_BULK_IMPORT, STUDENT_ROUTES, STUDENT_SWAGGER_TAG } from '../constants';
import {
  ApiBulkImportStudents,
  ApiCreateStudent,
  ApiGetStudentById,
  ApiListStudents,
} from '../decorators';
import {
  BulkImportResultResponseDto,
  CreateStudentDto,
  ListStudentsQueryDto,
  StudentResponseDto,
} from '../dtos';
import { FileParseInterceptor, type ParsedImportData } from '../interceptors';
import { StudentHttpMapper, StudentImportHttpMapper } from '../mappers';

@ApiTags(STUDENT_SWAGGER_TAG.name)
@Controller(STUDENT_ROUTES.BASE)
export class StudentsController {
  constructor(
    private readonly createUseCase: CreateStudentUseCase,
    private readonly getByIdUseCase: GetStudentByIdUseCase,
    private readonly listUseCase: ListStudentsUseCase,
    private readonly bulkImportUseCase: BulkImportStudentsUseCase,
  ) {}

  @Post()
  @ApiCreateStudent()
  async create(@Body() dto: CreateStudentDto): Promise<StudentResponseDto> {
    const command = new CreateStudentCommand(dto);
    const student = await this.createUseCase.execute(command);

    return StudentHttpMapper.toResponseFromCreate(student, command);
  }

  @Get(STUDENT_ROUTES.GET_BY_ID)
  @ApiGetStudentById()
  async getById(@Param('id', ParseIntPipe) id: number): Promise<StudentResponseDto> {
    const student = await this.getByIdUseCase.execute(id);

    return StudentHttpMapper.toResponse(student);
  }

  @Get()
  @ApiListStudents()
  async list(
    @Query() queryDto: ListStudentsQueryDto,
  ): Promise<PaginatedResultDto<StudentResponseDto>> {
    const pagination = new PaginationVO(queryDto.page, queryDto.pageSize);

    const query = new ListStudentsQuery(queryDto);
    const result = await this.listUseCase.execute(pagination, query);

    return StudentHttpMapper.toPaginatedResponse(result, pagination);
  }

  @Post(STUDENT_ROUTES.BULK_IMPORT)
  @ApiBulkImportStudents()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: STUDENT_BULK_IMPORT.MAX_FILE_SIZE_BYTES },
    }),
    FileParseInterceptor,
  )
  async bulkImport(
    @Req() req: Request & { importData: ParsedImportData },
  ): Promise<BulkImportResultResponseDto> {
    const { validRows, preErrors, totalRows } = req.importData;

    const commnad = new BulkImportStudentsCommand({
      validRows,
      preErrors,
      totalRows,
    });

    const result = await this.bulkImportUseCase.execute(commnad);

    return StudentImportHttpMapper.toResponse(result);
  }
}

import { type PaginatedResult, PaginationVO } from '@core/pagination';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  GetStudentImportByIdUseCase,
  ListStudentImportsUseCase,
  StartStudentImportUseCase,
} from '@students/application/use-cases';
import { memoryStorage } from 'multer';
import { STUDENT_IMPORT_UPLOAD } from '../constants';
import {
  ApiGetStudentImportById,
  ApiListStudentImports,
  ApiStartStudentImport,
} from '../decorators';
import { ListStudentImportsQueryDto, StudentImportReadModelResponseDto } from '../dtos';
import { StudentImportUploadInterceptor } from '../interceptors';
import { StudentImportRequestMapper, StudentImportResponseMapper } from '../mappers';
import { STUDENT_IMPORT_ROUTES, STUDENT_IMPORT_SWAGGER_TAG } from './student-routes.constants';

@ApiTags(STUDENT_IMPORT_SWAGGER_TAG.name)
@Controller(STUDENT_IMPORT_ROUTES.BASE)
export class StudentImportsController {
  constructor(
    private readonly listUseCase: ListStudentImportsUseCase,
    private readonly getByIdUseCase: GetStudentImportByIdUseCase,
    private readonly startImportUseCase: StartStudentImportUseCase,
  ) {}

  @Get()
  @ApiListStudentImports()
  async list(
    @Query() queryDto: ListStudentImportsQueryDto,
  ): Promise<PaginatedResult<StudentImportReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = StudentImportRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return StudentImportResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(STUDENT_IMPORT_ROUTES.GET_BY_ID)
  @ApiGetStudentImportById()
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentImportReadModelResponseDto> {
    const readModel = await this.getByIdUseCase.execute(id);

    return StudentImportResponseMapper.toReadModelResponse(readModel);
  }

  @Post()
  @ApiStartStudentImport()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: STUDENT_IMPORT_UPLOAD.MAX_FILE_SIZE_BYTES },
    }),
    StudentImportUploadInterceptor,
  )
  async startImport(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<{ studentImportId: string }> {
    // TODO: Cuando el módulo de auth exista, extraer el ID del token (req.user.id).
    // Fallback temporal usando un UUID de sistema.
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = StudentImportRequestMapper.toStartCommand(file, userId);
    const { studentImportId } = await this.startImportUseCase.execute(command);

    return { studentImportId };
  }
}

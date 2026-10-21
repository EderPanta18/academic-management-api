import { type PaginatedResult, PaginationVO } from '@core/pagination';
import {
  CancelEnrollmentUseCase,
  ConfirmEnrollmentUseCase,
  EnrollStudentUseCase,
  FinishEnrollmentUseCase,
  GetEnrollmentByIdUseCase,
  GetEnrollmentHistoryUseCase,
  ListEnrollmentsUseCase,
  RejectEnrollmentUseCase,
  WithdrawEnrollmentUseCase,
} from '@enrollments/application/use-cases';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCancelEnrollment,
  ApiConfirmEnrollment,
  ApiEnrollStudent,
  ApiFinishEnrollment,
  ApiGetEnrollmentById,
  ApiGetEnrollmentHistory,
  ApiListEnrollments,
  ApiRejectEnrollment,
  ApiWithdrawEnrollment,
} from '../decorators';
import {
  EnrollmentReadModelResponseDto,
  EnrollmentResponseDto,
  EnrollmentStatusLogReadModelResponseDto,
  EnrollmentTransitionRequestDto,
  EnrollStudentRequestDto,
  ListEnrollmentsQueryDto,
} from '../dtos';
import { EnrollmentRequestMapper, EnrollmentResponseMapper } from '../mappers';
import { ENROLLMENT_ROUTES, ENROLLMENT_SWAGGER_TAG } from './enrollment-routes.constants';

@ApiTags(ENROLLMENT_SWAGGER_TAG.name)
@Controller(ENROLLMENT_ROUTES.BASE)
export class EnrollmentsController {
  constructor(
    private readonly listUseCase: ListEnrollmentsUseCase,
    private readonly getByIdUseCase: GetEnrollmentByIdUseCase,
    private readonly getHistoryUseCase: GetEnrollmentHistoryUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
    private readonly confirmUseCase: ConfirmEnrollmentUseCase,
    private readonly cancelUseCase: CancelEnrollmentUseCase,
    private readonly withdrawUseCase: WithdrawEnrollmentUseCase,
    private readonly rejectUseCase: RejectEnrollmentUseCase,
    private readonly finishUseCase: FinishEnrollmentUseCase,
  ) {}

  @Get()
  @ApiListEnrollments()
  async list(
    @Query() queryDto: ListEnrollmentsQueryDto,
  ): Promise<PaginatedResult<EnrollmentReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = EnrollmentRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return EnrollmentResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(ENROLLMENT_ROUTES.GET_BY_ID)
  @ApiGetEnrollmentById()
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<EnrollmentReadModelResponseDto> {
    const readModel = await this.getByIdUseCase.execute(id);

    return EnrollmentResponseMapper.toReadModelResponse(readModel);
  }

  @Get(ENROLLMENT_ROUTES.HISTORY)
  @ApiGetEnrollmentHistory()
  async getHistory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EnrollmentStatusLogReadModelResponseDto[]> {
    const logs = await this.getHistoryUseCase.execute(id);

    return logs.map(EnrollmentResponseMapper.toStatusLogReadModelResponse);
  }

  @Post()
  @ApiEnrollStudent()
  async enroll(
    @Body() dto: EnrollStudentRequestDto,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // TODO: Cuando el módulo auth exista, extraer el ID del token (req.user.id).
    // Fallback temporal usando un UUID de sistema.
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toEnrollStudentCommand(dto, userId);
    const enrollment = await this.enrollStudentUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }

  @Patch(ENROLLMENT_ROUTES.CONFIRM)
  @ApiConfirmEnrollment()
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toConfirmCommand(id, userId);
    const enrollment = await this.confirmUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }

  @Patch(ENROLLMENT_ROUTES.CANCEL)
  @ApiCancelEnrollment()
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollmentTransitionRequestDto,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toCancelCommand(id, dto, userId);
    const enrollment = await this.cancelUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }

  @Patch(ENROLLMENT_ROUTES.WITHDRAW)
  @ApiWithdrawEnrollment()
  async withdraw(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollmentTransitionRequestDto,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toWithdrawCommand(id, dto, userId);
    const enrollment = await this.withdrawUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }

  @Patch(ENROLLMENT_ROUTES.REJECT)
  @ApiRejectEnrollment()
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollmentTransitionRequestDto,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toRejectCommand(id, dto, userId);
    const enrollment = await this.rejectUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }

  @Patch(ENROLLMENT_ROUTES.FINISH)
  @ApiFinishEnrollment()
  async finish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: EnrollmentTransitionRequestDto,
    @Req() req: Request,
  ): Promise<EnrollmentResponseDto> {
    // biome-ignore lint/suspicious/noExplicitAny: El módulo de autenticación aún no está implementado. Se tipará correctamente cuando exista.
    const userId = (req as any).user?.id || '00000000-0000-0000-0000-000000000000';

    const command = EnrollmentRequestMapper.toFinishCommand(id, dto, userId);
    const enrollment = await this.finishUseCase.execute(command);

    return EnrollmentResponseMapper.toResponse(enrollment);
  }
}

import {
  CancelAcademicPeriodUseCase,
  CloseAcademicPeriodUseCase,
  CreateAcademicPeriodUseCase,
  GetAcademicPeriodByIdUseCase,
  ListAcademicPeriodsUseCase,
  OpenAcademicPeriodUseCase,
  StartAcademicPeriodUseCase,
} from '@academic-periods/application/use-cases';
import { type PaginatedResult, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCancelAcademicPeriod,
  ApiCloseAcademicPeriod,
  ApiCreateAcademicPeriod,
  ApiGetAcademicPeriodById,
  ApiListAcademicPeriods,
  ApiOpenAcademicPeriod,
  ApiStartAcademicPeriod,
} from '../decorators';
import {
  AcademicPeriodReadModelResponseDto,
  AcademicPeriodResponseDto,
  CreateAcademicPeriodRequestDto,
  ListAcademicPeriodsQueryDto,
} from '../dtos';
import { AcademicPeriodRequestMapper, AcademicPeriodResponseMapper } from '../mappers';
import {
  ACADEMIC_PERIOD_ROUTES,
  ACADEMIC_PERIOD_SWAGGER_TAG,
} from './academic-period-routes.constants';

@ApiTags(ACADEMIC_PERIOD_SWAGGER_TAG.name)
@Controller(ACADEMIC_PERIOD_ROUTES.BASE)
export class AcademicPeriodsController {
  constructor(
    private readonly listUseCase: ListAcademicPeriodsUseCase,
    private readonly getByIdUseCase: GetAcademicPeriodByIdUseCase,
    private readonly createUseCase: CreateAcademicPeriodUseCase,
    private readonly openUseCase: OpenAcademicPeriodUseCase,
    private readonly startUseCase: StartAcademicPeriodUseCase,
    private readonly closeUseCase: CloseAcademicPeriodUseCase,
    private readonly cancelUseCase: CancelAcademicPeriodUseCase,
  ) {}

  @Get()
  @ApiListAcademicPeriods()
  async list(
    @Query() queryDto: ListAcademicPeriodsQueryDto,
  ): Promise<PaginatedResult<AcademicPeriodReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = AcademicPeriodRequestMapper.toListQuery(queryDto);
    const [items, total] = await this.listUseCase.execute(pagination, query);

    return AcademicPeriodResponseMapper.toPaginatedResponse(items, pagination, total);
  }

  @Get(ACADEMIC_PERIOD_ROUTES.GET_BY_ID)
  @ApiGetAcademicPeriodById()
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AcademicPeriodReadModelResponseDto> {
    const model = await this.getByIdUseCase.execute(id);

    return AcademicPeriodResponseMapper.toReadModelResponse(model);
  }

  @Post()
  @ApiCreateAcademicPeriod()
  async create(@Body() dto: CreateAcademicPeriodRequestDto): Promise<AcademicPeriodResponseDto> {
    const command = AcademicPeriodRequestMapper.toCreateCommand(dto);
    const period = await this.createUseCase.execute(command);

    return AcademicPeriodResponseMapper.toResponse(period);
  }

  @Patch(ACADEMIC_PERIOD_ROUTES.OPEN)
  @ApiOpenAcademicPeriod()
  async open(@Param('id', ParseUUIDPipe) id: string): Promise<AcademicPeriodResponseDto> {
    const period = await this.openUseCase.execute(id);

    return AcademicPeriodResponseMapper.toResponse(period);
  }

  @Patch(ACADEMIC_PERIOD_ROUTES.START)
  @ApiStartAcademicPeriod()
  async start(@Param('id', ParseUUIDPipe) id: string): Promise<AcademicPeriodResponseDto> {
    const period = await this.startUseCase.execute(id);

    return AcademicPeriodResponseMapper.toResponse(period);
  }

  @Patch(ACADEMIC_PERIOD_ROUTES.CLOSE)
  @ApiCloseAcademicPeriod()
  async close(@Param('id', ParseUUIDPipe) id: string): Promise<AcademicPeriodResponseDto> {
    const period = await this.closeUseCase.execute(id);

    return AcademicPeriodResponseMapper.toResponse(period);
  }

  @Patch(ACADEMIC_PERIOD_ROUTES.CANCEL)
  @ApiCancelAcademicPeriod()
  async cancel(@Param('id', ParseUUIDPipe) id: string): Promise<AcademicPeriodResponseDto> {
    const period = await this.cancelUseCase.execute(id);

    return AcademicPeriodResponseMapper.toResponse(period);
  }
}

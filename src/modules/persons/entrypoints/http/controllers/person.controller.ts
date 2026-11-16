// src/modules/persons/entrypoints/http/controllers/person.controller.ts

import { type PaginatedResult, PaginationVO } from '@core/pagination';
import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreatePersonUseCase,
  GetPersonUseCase,
  ListPersonsUseCase,
  UpdatePersonUseCase,
} from '@persons/application/use-cases';
import type { SwaggerTag } from '@platform/http';
import { CurrentUserId } from '@shared/decorators';
import { ApiCreatePerson, ApiGetPerson, ApiListPersons, ApiUpdatePerson } from '../decorators';
import {
  CreatePersonRequestDto,
  ListPersonsQueryDto,
  PersonReadModelResponseDto,
  PersonResponseDto,
  UpdatePersonRequestDto,
} from '../dtos';
import { PersonRequestMapper, PersonResponseMapper } from '../mappers';

const PERSON_ROUTES = {
  ROOT: 'persons',
  BY_ID: ':id',
} as const;

export const PERSON_SWAGGER_TAG = {
  name: 'persons',
  description: 'Endpoints relacionados con la gestión de personas.',
} as const satisfies SwaggerTag;

@ApiTags(PERSON_SWAGGER_TAG.name)
@Controller(PERSON_ROUTES.ROOT)
export class PersonController {
  constructor(
    private readonly listPersonsUseCase: ListPersonsUseCase,
    private readonly getPersonUseCase: GetPersonUseCase,
    private readonly createPersonUseCase: CreatePersonUseCase,
    private readonly updatePersonUseCase: UpdatePersonUseCase,
  ) {}

  @Get()
  @ApiListPersons()
  async list(
    @CurrentUserId() actorUserId: string,
    @Query() queryDto: ListPersonsQueryDto,
  ): Promise<PaginatedResult<PersonReadModelResponseDto>> {
    const pagination = PaginationVO.create({
      page: queryDto.page,
      limit: queryDto.limit,
    });

    const query = PersonRequestMapper.toListQuery(queryDto);

    const [items, totalItems] = await this.listPersonsUseCase.execute(
      actorUserId,
      pagination,
      query,
    );

    return PersonResponseMapper.toPaginatedResponse(items, pagination, totalItems);
  }

  @Get(PERSON_ROUTES.BY_ID)
  @ApiGetPerson()
  async getById(
    @CurrentUserId() actorUserId: string,
    @Param('id', ParseUUIDPipe) personId: string,
  ): Promise<PersonReadModelResponseDto> {
    const person = await this.getPersonUseCase.execute(actorUserId, personId);

    return PersonResponseMapper.toReadModelResponse(person);
  }

  @Post()
  @ApiCreatePerson()
  async create(
    @CurrentUserId() actorUserId: string,
    @Body() dto: CreatePersonRequestDto,
  ): Promise<PersonResponseDto> {
    const command = PersonRequestMapper.toCreateCommand(dto);

    const person = await this.createPersonUseCase.execute(actorUserId, command);

    return PersonResponseMapper.toResponse(person);
  }

  @Patch(PERSON_ROUTES.BY_ID)
  @ApiUpdatePerson()
  async update(
    @CurrentUserId() actorUserId: string,
    @Param('id', ParseUUIDPipe) personId: string,
    @Body() dto: UpdatePersonRequestDto,
  ): Promise<PersonResponseDto> {
    const command = PersonRequestMapper.toUpdateCommand(dto);

    const person = await this.updatePersonUseCase.execute(actorUserId, personId, command);

    return PersonResponseMapper.toResponse(person);
  }
}

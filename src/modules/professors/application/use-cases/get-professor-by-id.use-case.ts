// modules/professors/application/use-cases/get-professor-by-id.use-case.ts

import { Inject, Injectable } from "@nestjs/common";

import { ProfessorNotFoundException } from "@professors/domain/exceptions";
import {
  PROFESSOR_QUERY_PORT,
  type IProfessorQuery
} from "@professors/application/ports/out";
import type { ProfessorView } from "../read-models";

@Injectable()
export class GetProfessorByIdUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_PORT)
    private readonly professorQuery: IProfessorQuery
  ) {}

  async execute(id: number): Promise<ProfessorView> {
    const view = await this.professorQuery.findById(id);

    if (!view) throw new ProfessorNotFoundException(id);

    return view;
  }
}

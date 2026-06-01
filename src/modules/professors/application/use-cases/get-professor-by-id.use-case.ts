// modules/professors/application/use-cases/get-professor-by-id.use-case.ts

import { Inject, Injectable } from "@nestjs/common";
import { ProfessorNotFoundException } from "@professors/domain/exceptions";
import { type ProfessorView } from "../read-models";
import {
  PROFESSOR_QUERY_PORT,
  type IProfessorQuery
} from "@modules/professors/application/ports/out";

@Injectable()
export class GetProfessorByIdUseCase {
  constructor(
    @Inject(PROFESSOR_QUERY_PORT)
    private readonly query: IProfessorQuery
  ) {}

  async execute(id: number): Promise<ProfessorView> {
    const view = await this.query.findById(id);
    if (!view) throw new ProfessorNotFoundException(id);
    return view;
  }
}

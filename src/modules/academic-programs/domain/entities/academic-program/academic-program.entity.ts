import type { AcademicProgramProps, CreateAcademicProgramProps } from './academic-program.types';

export class AcademicProgram {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly academicUnit: string | null;

  private constructor(props: AcademicProgramProps) {
    this.id = props.id;
    this.code = props.code;
    this.name = props.name;
    this.academicUnit = props.academicUnit;

    Object.freeze(this);
  }

  static reconstitute(props: AcademicProgramProps): AcademicProgram {
    return new AcademicProgram(props);
  }

  static create(props: CreateAcademicProgramProps): AcademicProgram {
    return new AcademicProgram({
      ...props,
      academicUnit: props.academicUnit ?? null,
    });
  }
}

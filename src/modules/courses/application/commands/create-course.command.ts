// modules/courses/application/commands/create-course.command.ts

interface CreateCourseCommandProps {
  careerId: number;
  name: string;
  credits: number;
  categoryId?: number;
  description?: string;
}

export class CreateCourseCommand {
  readonly careerId: number;
  readonly name: string;
  readonly credits: number;
  readonly categoryId?: number;
  readonly description?: string;

  constructor(props: CreateCourseCommandProps) {
    this.careerId = props.careerId;
    this.name = props.name;
    this.credits = props.credits;
    this.categoryId = props.categoryId;
    this.description = props.description;
  }
}

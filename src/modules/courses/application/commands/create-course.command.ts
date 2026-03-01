// modules/courses/application/commands/create-course.command.ts

export class CreateCourseCommand {
  readonly careerId: number;
  readonly name: string;
  readonly credits: number;
  readonly categoryId?: number;
  readonly description?: string;

  constructor(props: CreateCourseCommand) {
    this.careerId = props.careerId;
    this.name = props.name;
    this.credits = props.credits;
    this.categoryId = props.categoryId;
    this.description = props.description;
  }
}

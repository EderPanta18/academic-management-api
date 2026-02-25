// shared/domain/events/base.event.ts

export abstract class BaseEvent {
  abstract readonly eventName: string;
  readonly occurredAt: Date;

  constructor() {
    this.occurredAt = new Date();
    Object.freeze(this);
  }
}

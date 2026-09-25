// core/contracts/event-bus.contract.ts

export const EVENT_BUS_TOKEN = Symbol('EVENT_BUS');

export type EventPublishOptions = {
  delay?: number;
  idempotencyKey?: string;
};

export type EventSubscribeOptions = {
  concurrency?: number;
};

export type EventHandler<T> = (payload: T) => Promise<void>;

export type EventHandle = {
  eventName: string;
  publishedAt: Date;
};

export type SubscriptionHandle = {
  eventName: string;
  subscribedAt: Date;
};

export interface IEventBus {
  publish<T>(eventName: string, payload: T, options?: EventPublishOptions): Promise<EventHandle>;

  subscribe<T>(
    eventName: string,
    handler: EventHandler<T>,
    options?: EventSubscribeOptions,
  ): Promise<SubscriptionHandle>;

  closeAll(): Promise<void>;
}

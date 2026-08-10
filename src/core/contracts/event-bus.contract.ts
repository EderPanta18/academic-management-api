// src/core/contracts/event-bus.contract.ts

export const EVENT_BUS_TOKEN = Symbol('EVENT_BUS');

export type EventPublishOptions = {
  delay?: number;
  idempotencyKey?: string;
};

export type EventSubscribeOptions = {
  concurrency?: number;
};

export type EventHandler<T extends Record<string, unknown>> = (payload: T) => Promise<void>;

export interface EventBus {
  publish<T extends Record<string, unknown>>(
    eventName: string,
    payload: T,
    options?: EventPublishOptions,
  ): Promise<void>;

  subscribe<T extends Record<string, unknown>>(
    eventName: string,
    handler: EventHandler<T>,
    options?: EventSubscribeOptions,
  ): Promise<void>;

  unsubscribe(eventName: string): Promise<void>;

  closeAll(): Promise<void>;
}

// src/core/contracts/event-bus.contract.ts

export const EVENT_BUS_TOKEN = Symbol('EVENT_BUS');

export type EventPublishOptions = {
  delayMs?: number;
  idempotencyKey?: string;
};

export type EventSubscribeOptions = {
  concurrency?: number;
};

export type EventHandler<T> = (payload: T) => Promise<void>;

export type EventPublishResult = { status: 'accepted' } | { status: 'duplicate' };

export type SubscriptionHandle = {
  /** Detiene la recepción de nuevas entregas de esta suscripción. */
  unsubscribe(): Promise<void>;
};

export interface IEventBus {
  /**
   * 'accepted' confirma aceptación por el transporte, no ejecución del consumidor.
   * 'duplicate' exige evidencia de aceptación previa para la misma identidad.
   * Si no puede confirmar la entrega o se rechaza, falla; no simula éxito.
   */
  publish<T>(
    eventName: string,
    payload: T,
    options?: EventPublishOptions,
  ): Promise<EventPublishResult>;

  subscribe<T>(
    eventName: string,
    handler: EventHandler<T>,
    options?: EventSubscribeOptions,
  ): Promise<SubscriptionHandle>;
}

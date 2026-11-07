// src/core/types/actor-context.types.ts

export type ActorContext = Readonly<{
  userId: string;
  sessionId?: string;
}>;

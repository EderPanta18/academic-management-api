// src/core/contracts/transaction.contract.ts

export const TRANSACTION_MANAGER_TOKEN = Symbol('TRANSACTION_MANAGER');

export abstract class TransactionContext {
  protected constructor() {}
}

export type TransactionIsolation = 'READ_COMMITTED' | 'SERIALIZABLE';

export type TransactionOptions = {
  isolation?: TransactionIsolation;
  retries?: number;
};

export interface ITransactionManager {
  run<T>(
    operation: (tx: TransactionContext) => Promise<T>,
    options?: TransactionOptions,
  ): Promise<T>;
}

// src/core/contracts/transaction.contract.ts

export const TRANSACTION_MANAGER_TOKEN = Symbol('TRANSACTION_MANAGER');

export type TransactionIsolation = 'READ_COMMITTED' | 'SERIALIZABLE';

export type TransactionOptions = {
  isolation?: TransactionIsolation;
  retries?: number;
};

export interface ITransactionManager {
  run<T>(operation: () => Promise<T>, options?: TransactionOptions): Promise<T>;

  /**
   * Indica si existe una transacción activa en el contexto actual.
   */
  isActive(): boolean;
}

export const USER_EXISTENCE_CHECKER_TOKEN = Symbol('USER_EXISTENCE_CHECKER');

export interface IUserExistenceChecker {
  exists(id: string): Promise<boolean>;
}

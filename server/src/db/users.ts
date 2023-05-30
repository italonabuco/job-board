import { connection } from './connection.ts';
import { UserEntity } from './types.ts';

const getUserTable = () => connection.table<UserEntity>('user');

export async function getUser(id: string) {
  return await getUserTable().first().where({ id });
}

export async function getUserByEmail(email: string) {
  return await getUserTable().first().where({ email });
}

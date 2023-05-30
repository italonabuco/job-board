import DataLoader from 'dataloader';
import { connection } from './connection.ts';
import { CompanyEntity } from './types.ts';

const getCompanyTable = () => connection.table<CompanyEntity>('company');

export async function getCompany(id: string) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  return new DataLoader(async (ids: string[]) => {
    const companies = await getCompanyTable().select().whereIn('id', ids);
    // data loader requires that data should be return in the same order as the keys we are requesting
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}

import DataLoader from 'dataloader';
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export function createCompanyLoader() {
  return new DataLoader(async (ids) => {
    console.log('[companyLoader] ids', ids);
    const companies = await getCompanyTable().select().whereIn('id', ids);
    // data loader requires that data should be return in the same order as the keys we are requesting
    return ids.map((id) => companies.find((company) => company.id === id));
  });
}

import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.ts';
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  updateJob,
} from './db/jobs.ts';
import { Resolvers } from './generated/schema.ts';
import DataLoader from 'dataloader';
import { CompanyEntity, JobEntity, UserEntity } from './db/types.ts';

export interface ResolverContext {
  companyLoader: DataLoader<string, CompanyEntity, string>;
  jobsByCompanyLoader: DataLoader<string, JobEntity[], string>;
  user?: UserEntity;
}

export const resolvers: Resolvers = {
  Query: {
    //root is the parent object, _[name] means that is unused
    company: (_root, { id }) =>
      checkNotFound(getCompany('' + id), `No company found with id=[${id}]`),
    job: (_root, args) =>
      checkNotFound(getJob('' + args.id), `No job found with id=[${args.id}]`),
    jobs: async (_root, { limit, offset }) => {
      const items = await getJobs(limit, offset);
      const totalCount = await countJobs();
      return { items, totalCount };
    },
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, context) => {
      const { user } = context;
      await isAuthenticate(user);
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      await isAuthenticate(user);
      return deleteJob('' + id, user.companyId);
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      await isAuthenticate(user);
      return updateJob({
        id: '' + id,
        title,
        description,
        companyId: user.companyId,
      });
    },
  },

  Company: {
    jobs: (company, _args, { jobsByCompanyLoader }) =>
      jobsByCompanyLoader.load(company.id),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt), // job is the parent object
    company: (job, _args, { companyLoader }) =>
      companyLoader.load(job.companyId),
  },
};

function isAuthenticate(auth, message = 'Unauthorized request') {
  if (!auth) {
    throw new GraphQLError(message, { extensions: { code: 'UNAUTHORIZED' } });
  }
  return auth;
}
async function checkNotFound(req, message = 'Not found') {
  const data = await req;
  if (!data) {
    throw new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });
  }
  return data;
}

function toIsoDate(value: string) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

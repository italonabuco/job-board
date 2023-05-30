import { GraphQLError } from 'graphql';
import { companyLoader, getCompany } from './db/companies.js';
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from './db/jobs.js';

export const resolvers = {
  Query: {
    //root is the parent object, _[name] means that is unused
    company: (_root, args) =>
      checkNotFound(
        getCompany(args.id),
        `No company found with id=[${args.id}]`
      ),
    job: (_root, args) =>
      checkNotFound(getJob(args.id), `No job found with id=[${args.id}]`),
    jobs: () => getJobs(),
  },

  Mutation: {
    createJob: async (_root, { input: { title, description } }, context) => {
      const { user } = context;
      await isAuthenticate(user);
      return createJob({ companyId: user.companyId, title, description });
    },
    deleteJob: async (_root, { id }, { user }) => {
      await isAuthenticate(user);
      return deleteJob(id, user.companyId);
    },
    updateJob: async (
      _root,
      { input: { id, title, description } },
      { user }
    ) => {
      await isAuthenticate(user);
      return updateJob({ id, title, description, companyId: user.companyId });
    },
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt), // job is the parent object
    company: (job) => companyLoader.load(job.companyId),
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

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

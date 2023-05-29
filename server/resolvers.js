import { GraphQLError } from 'graphql';
import { getCompany } from './db/companies.js';
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js';

export const resolvers = {
  Query: {
    //root is the parent object, _[name] means that is unused
    company: (_root, args) =>
      checkNotFound(getCompany(args.id))(
        `No company found with id=[${args.id}]`
      ),
    job: (_root, args) =>
      checkNotFound(getJob(args.id))(`No job found with id=[${args.id}]`),
    jobs: () => getJobs(),
  },

  Company: {
    jobs: (company) => getJobsByCompany(company.id),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt), // job is the parent object
    company: (job) => getCompany(job.companyId),
  },
};

function checkNotFound(req) {
  return async function (message = 'Not found') {
    const data = await req;
    if (!data) {
      throw new GraphQLError(message, { extensions: { code: 'NOT_FOUND' } });
    }
    return data;
  };
}

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

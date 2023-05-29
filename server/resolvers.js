import { getCompany } from './db/companies.js';
import { getJob, getJobs } from './db/jobs.js';

export const resolvers = {
  Query: {
    //root is the parent object, _[name] means that is unused
    job: (_root, args) => getJob(args.id),
    jobs: () => getJobs(),
  },

  Job: {
    date: (job) => toIsoDate(job.createdAt), // job is the parent object
    company: (job) => getCompany(job.companyId),
  },
};

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

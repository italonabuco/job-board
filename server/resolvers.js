import { getCompany } from './db/companies.js';
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js';

export const resolvers = {
  Query: {
    //root is the parent object, _[name] means that is unused
    company: (_root, args) => getCompany(args.id),
    job: (_root, args) => getJob(args.id),
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

function toIsoDate(value) {
  return value.slice(0, 'yyyy-mm-dd'.length);
}

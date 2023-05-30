import { useMutation, useQuery } from '@apollo/client';
import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from './queries';

export function useCompany(id) {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id) {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs() {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
  });
  return { jobs: data?.jobs, loading, error: Boolean(error) };
}

export function useCreateJob() {
  const [mutate, { loading, error, data }] = useMutation(createJobMutation, {
    update: (cache, { data }) => {
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });

  const createJob = async ({ title, description }) => {
    return await mutate({
      variables: { input: { title, description } },
    });
  };
  return { createJob, loading, error, job: data?.job };
}

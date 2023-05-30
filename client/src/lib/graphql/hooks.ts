import { useMutation, useQuery } from '@apollo/client';
import {
  companyByIdQuery,
  createJobMutation,
  jobByIdQuery,
  jobsQuery,
} from './queries';

export function useCompany(id: string) {
  const { data, error, loading } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
}

export function useJob(id: string) {
  const { data, error, loading } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
}

export function useJobs(limit?: number, offset?: number) {
  const { data, error, loading } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
    variables: {
      limit,
      offset,
    },
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

  const createJob = async ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    return await mutate({
      variables: { input: { title, description } },
    });
  };
  return { createJob, loading, error, job: data?.job };
}

import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';
import { getAccessToken } from '../auth';
import { graphql } from '../../generated/gql';

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }
  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only', // ensures new data will be fetched every time instead of using cache
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only',
  //   },
  // },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jobDetailFragment = graphql(`
  fragment JobDetail on Job {
    id
    date
    title
    company {
      id
      name
    }
    description
  }
`);

export const jobByIdQuery = graphql(`
  #JobById is just an alias for debugging
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
`);

export const jobsQuery = graphql(`
  query GetJobs($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        title
        date
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`);

export const companyByIdQuery = graphql(`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        date
        title
      }
    }
  }
`);

export const createJobMutation = graphql(`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
`);

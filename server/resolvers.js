export const resolvers = {
  Query: {
    jobs: () => {
      return [
        {
          id: 'job-id-1',
          title: 'The title 1',
          description: 'The description',
        },
        {
          id: 'job-id-2',
          title: 'The title 2',
          description: 'The description',
        },
      ];
    },
  },
};

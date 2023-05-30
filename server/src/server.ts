import cors from 'cors';
import express from 'express';
import { authMiddleware, handleLogin } from './auth.ts';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { readFile } from 'node:fs/promises';
import { resolvers } from './resolvers.ts';
import { getUser } from './db/users.ts';
import { createCompanyLoader } from './db/companies.ts';
import { createJobsByCompanyLoader } from './db/jobs.ts';

const PORT = 4000;

const app = express();
app.use(cors(), express.json(), authMiddleware);

app.post('/login', handleLogin);

const typeDefs = await readFile('./schema.graphql', 'utf8'); // read and return single string
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
await apolloServer.start();

async function getContext({ req }) {
  // this way, a new load is going to be available for each request. Avoiding the cache issue.
  // If the data is not supposed to change of system life, we do not need to create a loader for each request.
  const companyLoader = createCompanyLoader();
  const jobsByCompanyLoader = createJobsByCompanyLoader();
  const context: any = { companyLoader, jobsByCompanyLoader };
  if (req.auth) {
    context.user = await getUser(req.auth.sub);
  }
  return context;
}

// everything regarding apollo will go through this path
app.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});

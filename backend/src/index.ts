import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request, Response, NextFunction } from 'express';
import { initDb } from './database/index';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import resolvers from './graphql/resolvers/index';
import { checkJwt } from './util/authMiddleware';

// Extend the Express Request type with the user property
declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with your User type if available
    }
  }
}

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema/schema.graphql'), 'utf8');

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');

    await server.start();

    app.use(cors());
    app.use(express.json());
    app.use(checkJwt); // JWT Middleware

    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async ({ req }: { req: Request }) => {
          // Now properly typed with the extended Request type
          return { user: req.user };
        },
      }),
    );

    httpServer.listen({ port: 5127 }, () => {
      console.log(`🚀 Server ready at http://localhost:5127/graphql`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();

// Error handling middleware to capture JWT errors and others
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.status(err.status).send({ error: err.message });
    return;
  }
  next(err);
});


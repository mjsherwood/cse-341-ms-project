import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Request, Response, NextFunction } from 'express';
import { initDb } from './database/index';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import resolvers from './graphql/resolvers/index';
import { isTokenValid } from './util/authValidation';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const typeDefs = fs.readFileSync(path.join(__dirname, 'graphql/schema/schema.graphql'), 'utf8');

const app = express();
const httpServer = http.createServer(app);

// // JWT Middleware
// app.use(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization || '';
//     const authResult = await isTokenValid(token);
//     if (authResult.error) {
//         res.status(401).send({ error: 'You must be logged in' });
//         return;
//     }
//     req.user = authResult.decoded;
//     next();
// });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }: { req: Request }) => {
    const token = req.headers.authorization || '';
    const authResult = await isTokenValid(token);
    // Now just pass the token and decoded user (if any) to the resolvers
    return { token, user: authResult.error ? null : authResult.decoded };
  },
} as any);

const startServer = async () => {
  try {
    await initDb();
    console.log('Database initialized');

    await server.start();  // Ensure server is started before applying middleware

    app.use(cors());
    app.use(express.json());

    // Use expressMiddleware method to apply middleware
    app.use('/graphql', expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        return { user: req.user };
      },
    }));

    httpServer.listen({ port: 5127 }, () => {
      console.log(`🚀 Server ready at http://localhost:5127/graphql`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

startServer();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ error: err.message });
        return;
    }
    next(err);
});
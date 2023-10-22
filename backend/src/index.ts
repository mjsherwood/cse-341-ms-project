import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { initDb } from './database';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
import fs from 'fs';
import path from 'path';
import resolvers from './resolvers/index';

const { json } = pkg;

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

const app = express();
const httpServer = http.createServer(app);

interface MyContext {
  token?: string;
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: true, // Enables introspection of the schema
});

const startServer = async () => {
  try {
    await initDb(); // Initialize the database here
    console.log('Database initialized');

    await server.start();
    app.use(
      '/graphql',
      cors(),
      json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ token: req.headers.token as string }),
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
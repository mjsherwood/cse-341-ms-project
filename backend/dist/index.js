"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = __importDefault(require("./resolvers/index"));
const { json } = body_parser_1.default;
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, 'schema.graphql'), 'utf8');
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers: index_1.default,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    introspection: true, // Enables introspection of the schema
});
const startServer = async () => {
    try {
        await (0, database_1.initDb)(); // Initialize the database here
        console.log('Database initialized');
        await server.start();
        app.use('/graphql', (0, cors_1.default)(), json(), (0, express4_1.expressMiddleware)(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        }));
        httpServer.listen({ port: 5127 }, () => {
            console.log(`🚀 Server ready at http://localhost:5127/graphql`);
        });
    }
    catch (error) {
        console.error('Failed to start the server:', error);
    }
};
startServer();

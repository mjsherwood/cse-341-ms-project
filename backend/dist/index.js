"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const index_1 = require("./database/index");
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_2 = __importDefault(require("./graphql/resolvers/index"));
const authValidation_1 = require("./util/authValidation");
const typeDefs = fs_1.default.readFileSync(path_1.default.join(__dirname, 'graphql/schema/schema.graphql'), 'utf8');
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
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
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers: index_2.default,
    introspection: true,
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const authResult = await (0, authValidation_1.isTokenValid)(token);
        // Now just pass the token and decoded user (if any) to the resolvers
        return { token, user: authResult.error ? null : authResult.decoded };
    },
});
const startServer = async () => {
    try {
        await (0, index_1.initDb)();
        console.log('Database initialized');
        await server.start(); // Ensure server is started before applying middleware
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        // Use expressMiddleware method to apply middleware
        app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
            context: async ({ req }) => {
                return { user: req.user };
            },
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
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(err.status).send({ error: err.message });
        return;
    }
    next(err);
});

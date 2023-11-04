"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userResolvers_1 = __importDefault(require("./userResolvers"));
const recipeResolvers_1 = __importDefault(require("./recipeResolvers"));
const checkAuth = (resolver) => (parent, args, context, info) => {
    if (!context.user) {
        throw new Error('You must be logged in to do this');
    }
    return resolver(parent, args, context, info);
};
const wrapMutations = (mutations) => {
    const wrapped = {};
    for (const [key, resolver] of Object.entries(mutations)) {
        wrapped[key] = checkAuth(resolver);
    }
    return wrapped;
};
const resolvers = {
    Query: {
        ...userResolvers_1.default.Query,
        ...recipeResolvers_1.default.Query,
    },
    Mutation: {
        ...wrapMutations(userResolvers_1.default.Mutation),
        ...wrapMutations(recipeResolvers_1.default.Mutation),
    },
};
exports.default = resolvers;

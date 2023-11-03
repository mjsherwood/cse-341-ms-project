"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userResolvers_1 = __importDefault(require("./userResolvers"));
const recipeResolvers_1 = __importDefault(require("./recipeResolvers"));
const resolvers = {
    Query: {
        ...userResolvers_1.default.Query,
        ...recipeResolvers_1.default.Query,
    },
    Mutation: {
        ...userResolvers_1.default.Mutation,
        ...recipeResolvers_1.default.Mutation,
    },
};
exports.default = resolvers;

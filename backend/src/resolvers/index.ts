import userResolvers from './userResolvers';
import recipeResolvers from './recipeResolvers';

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...recipeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...recipeResolvers.Mutation,
  },
};

export default resolvers;
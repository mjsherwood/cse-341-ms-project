import userResolvers from './userResolvers';
import recipeResolvers from './recipeResolvers';

type ResolverFunction = (
  parent: any,
  args: any,
  context: { user: any },
  info: any
) => any;

const checkAuth = (resolver: ResolverFunction): ResolverFunction => (
  parent,
  args,
  context,
  info
) => {
  if (!context.user) {
    // Optionally, you could also check `context.token` if needed
    throw new Error('You must be logged in to do this');
  }
  return resolver(parent, args, context, info);
};

const wrapMutations = (mutations: Record<string, ResolverFunction>): Record<string, ResolverFunction> => {
  const wrapped: Record<string, ResolverFunction> = {};
  for (const [key, resolver] of Object.entries(mutations)) {
    wrapped[key] = checkAuth(resolver);
  }
  return wrapped;
};

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...recipeResolvers.Query,
  },
  Mutation: {
    ...wrapMutations(userResolvers.Mutation),
    ...wrapMutations(recipeResolvers.Mutation),
  },
};

export default resolvers;



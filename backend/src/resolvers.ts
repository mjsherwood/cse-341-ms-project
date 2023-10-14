import { getDb } from './database';  // Update this with the actual path to your database file

const resolvers = {
  Query: {
    recipes: async () => {
      try {
        const db = getDb();
        const recipes = await db.collection('recipes').find().toArray();
        return recipes;
      } catch (error) {
        console.error('Error fetching recipes:', error);
        throw new Error('Error fetching recipes');
      }
    },
  },

  Mutation: {
    addRecipe: async (_: any, args: any) => {
      try {
        const db = getDb();  // Get the database instance
        const result = await db.collection('recipes').insertOne(args);
  
        if (!result.insertedId) {
          throw new Error('Failed to insert recipe');
        }
  
        // Retrieve the inserted recipe from the database
        const newRecipe = await db.collection('recipes').findOne({ _id: result.insertedId });
        return newRecipe;
      } catch (error) {
        console.error('Error adding recipe:', error);  // Log the actual error
        throw new Error('Error adding recipe');
      }
    },

    updateRecipe: async (_: any, args: any) => {
      try {
        const db = getDb();
        const result = await db.collection('recipes').findOneAndUpdate(
          { _id: args.id },  // filter
          { $set: args },  // update
          { returnDocument: 'after' }  // options
        );
        if (!result.value) {
          throw new Error('Recipe not found');
        }
        return result.value;
      } catch (error) {
        console.error('Error updating recipe:', error);
        throw new Error('Error updating recipe');
      }
    },

    deleteRecipe: async (_: any, args: any) => {
      try {
        const db = getDb();
        const result = await db.collection('recipes').findOneAndDelete({ _id: args.id });
        if (!result.value) {
          throw new Error('Recipe not found');
        }
        return result.value;
      } catch (error) {
        console.error('Error deleting recipe:', error);
        throw new Error('Error deleting recipe');
      }
    },
  },
};

export default resolvers;
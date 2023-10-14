import { getDb } from './database';  // Update this with the actual path to your database file
import { ObjectId } from 'mongodb';

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
    recipe: async (_: any, args: any) => {
      try {
        const db = getDb();
        const recipe = await db.collection('recipes').findOne({ _id: new ObjectId(args.id) });
        if (!recipe) {
          console.error('Recipe not found');
          throw new Error('Recipe not found');
        }
        return recipe;
      } catch (error) {
        console.error('Error fetching recipe:', error);
        throw new Error('Error fetching recipe');
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
          { _id: new ObjectId(args.id) },  // filter
          { $set: args },  // update
          { returnDocument: 'after' }  // options
        );
        if (!result || !result.value) { // Add null check for result here
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
        const result = await db.collection('recipes').findOneAndDelete({ _id: new ObjectId(args.id) });
        if (!result || !result.value) { // Add null check for result here
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

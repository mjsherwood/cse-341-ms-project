import { getDb } from '../database';
import { ObjectId } from 'mongodb';

function isWithId(obj: any): obj is { _id: ObjectId } {
  return obj && obj._id !== undefined;
}

const recipeResolvers = {
  Query: {
    recipes: async () => {
      try {
        const db = getDb();
        const recipes = await db.collection('recipes').find().toArray();
    
        return recipes.map(recipe => ({
          ...recipe,
          id: recipe._id.toString(),
        }));
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

        return {
          ...recipe,
          id: recipe._id.toString(),
        };
      } catch (error) {
        console.error('Error fetching recipe:', error);
        throw new Error('Error fetching recipe');
      }
    },
  },

  Mutation: {
    addRecipe: async (_: any, args: any) => {
      try {
        const db = getDb();  
        const result = await db.collection('recipes').insertOne(args);
    
        if (!result.insertedId) {
          throw new Error('Failed to insert recipe');
        }
    
        const newRecipe = await db.collection('recipes').findOne({ _id: result.insertedId });
    
        if (!newRecipe) {
          throw new Error('Inserted recipe not found');
        }
    
        return {
          ...newRecipe,
          id: newRecipe._id.toString(),
        };
      } catch (error) {
        console.error('Error adding recipe:', error);  
        throw new Error('Error adding recipe');
      }
    },

    updateRecipe: async (_: any, args: any) => {
      try {
          const db = getDb();
          const updateArgs = { ...args.input };
  
          const result = await db.collection('recipes').findOneAndUpdate(
              { _id: new ObjectId(args.id) },
              { $set: updateArgs },
              { returnDocument: 'after' }
          );
  
          const updatedRecipe = result.value || result;
          if (!isWithId(updatedRecipe)) {
              console.error('Recipe not found or update failed: No additional error information');
              throw new Error('Recipe not found or update failed');
          }
  
          return {
              ...updatedRecipe,
              id: updatedRecipe._id.toString(),
          };
      } catch (error) {
          console.error('Error updating recipe:', error);
          throw new Error('Error updating recipe');
      }
    },
    
    deleteRecipe: async (_: any, args: any) => {
      try {
        const db = getDb();
        const recipeId = new ObjectId(args.id);

        const existingRecipe = await db.collection('recipes').findOne({ _id: recipeId });
    
        if (!existingRecipe) {
          throw new Error('Recipe not found');
        }
    
        await db.collection('recipes').findOneAndDelete({ _id: recipeId });

        return {
          ...existingRecipe,
          id: existingRecipe._id.toString(),
        };
      } catch (error) {
        console.error('Error deleting recipe:', error);
        throw new Error('Error deleting recipe');
      }
    },
  }
};

export default recipeResolvers;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database"); // Update this with the actual path to your database file
const mongodb_1 = require("mongodb");
const resolvers = {
    Query: {
        recipes: async () => {
            try {
                const db = (0, database_1.getDb)();
                const recipes = await db.collection('recipes').find().toArray();
                return recipes;
            }
            catch (error) {
                console.error('Error fetching recipes:', error);
                throw new Error('Error fetching recipes');
            }
        },
        recipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const recipe = await db.collection('recipes').findOne({ _id: new mongodb_1.ObjectId(args.id) });
                if (!recipe) {
                    console.error('Recipe not found');
                    throw new Error('Recipe not found');
                }
                return recipe;
            }
            catch (error) {
                console.error('Error fetching recipe:', error);
                throw new Error('Error fetching recipe');
            }
        },
    },
    Mutation: {
        addRecipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)(); // Get the database instance
                const result = await db.collection('recipes').insertOne(args);
                if (!result.insertedId) {
                    throw new Error('Failed to insert recipe');
                }
                // Retrieve the inserted recipe from the database
                const newRecipe = await db.collection('recipes').findOne({ _id: result.insertedId });
                return newRecipe;
            }
            catch (error) {
                console.error('Error adding recipe:', error); // Log the actual error
                throw new Error('Error adding recipe');
            }
        },
        updateRecipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const result = await db.collection('recipes').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: args }, { returnDocument: 'after' });
                if (!result || !result.value) { // Check if result is not null here
                    console.error('Recipe not found for ID:', args.id);
                    throw new Error('Recipe not found');
                }
                return result.value;
            }
            catch (error) {
                console.error('Specific error updating recipe:', error);
                if (error instanceof Error) {
                    throw new Error('Error updating recipe: ' + error.message);
                }
                else {
                    throw new Error('An unexpected error occurred while updating the recipe.');
                }
            }
        },
        deleteRecipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const result = await db.collection('recipes').findOneAndDelete({ _id: new mongodb_1.ObjectId(args.id) });
                if (!result || !result.value) { // Add null check for result here
                    throw new Error('Recipe not found');
                }
                return result.value;
            }
            catch (error) {
                console.error('Error deleting recipe:', error);
                throw new Error('Error deleting recipe');
            }
        },
    },
};
exports.default = resolvers;

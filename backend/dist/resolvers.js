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
                // Transform _id to id
                return recipes.map(recipe => ({
                    ...recipe,
                    id: recipe._id.toString(),
                }));
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
                // Transform _id to id
                return {
                    ...recipe,
                    id: recipe._id.toString(),
                };
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
                const db = (0, database_1.getDb)();
                const result = await db.collection('recipes').insertOne(args);
                if (!result.insertedId) {
                    throw new Error('Failed to insert recipe');
                }
                const newRecipe = await db.collection('recipes').findOne({ _id: result.insertedId });
                if (!newRecipe) {
                    throw new Error('Inserted recipe not found');
                }
                // Transform _id to id
                return {
                    ...newRecipe,
                    id: newRecipe._id.toString(),
                };
            }
            catch (error) {
                console.error('Error adding recipe:', error);
                throw new Error('Error adding recipe');
            }
        },
        updateRecipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const updateArgs = {
                    ...args.input
                };
                const result = await db.collection('recipes').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                if (!result.value) {
                    throw new Error('Recipe not found');
                }
                // Transform _id to id
                return {
                    ...result.value,
                    id: result.value._id.toString(),
                };
            }
            catch (error) {
                console.error('Error updating recipe:', error);
                throw new Error('Error updating recipe');
            }
        },
        deleteRecipe: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const recipeId = new mongodb_1.ObjectId(args.id);
                const existingRecipe = await db.collection('recipes').findOne({ _id: recipeId });
                if (!existingRecipe) {
                    throw new Error('Recipe not found');
                }
                await db.collection('recipes').findOneAndDelete({ _id: recipeId });
                // Transform _id to id
                return {
                    ...existingRecipe,
                    id: existingRecipe._id.toString(),
                };
            }
            catch (error) {
                console.error('Error deleting recipe:', error);
                throw new Error('Error deleting recipe');
            }
        },
    },
};
exports.default = resolvers;

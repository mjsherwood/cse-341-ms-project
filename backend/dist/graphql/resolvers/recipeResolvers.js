"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const mongodb_1 = require("mongodb");
const validation_1 = require("../../util/validation");
const transformRecipe = (recipe) => ({
    ...recipe,
    id: recipe._id.toString(),
});
function isWithId(obj) {
    return obj && obj._id !== undefined;
}
const recipeResolvers = {
    Query: {
        recipes: async () => {
            try {
                const db = (0, database_1.getDb)();
                const recipes = await db.collection('recipes').find().toArray();
                return recipes.map(transformRecipe);
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
                return transformRecipe(recipe);
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
                await validation_1.RecipeInputSchema.validate(args); // Validation
                const db = (0, database_1.getDb)();
                const result = await db.collection('recipes').insertOne(args);
                if (!result.insertedId) {
                    throw new Error('Failed to insert recipe');
                }
                const newRecipe = await db.collection('recipes').findOne({ _id: result.insertedId });
                if (!newRecipe) {
                    throw new Error('Inserted recipe not found');
                }
                return transformRecipe(newRecipe);
            }
            catch (error) {
                console.error('Error adding recipe:', error);
                throw new Error('Error adding recipe');
            }
        },
        updateRecipe: async (_, args) => {
            try {
                await validation_1.RecipeInputSchema.validate(args.input); // Validation
                const db = (0, database_1.getDb)();
                const updateArgs = { ...args.input };
                const result = await db.collection('recipes').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                const updatedRecipe = result?.value || result;
                if (!isWithId(updatedRecipe)) {
                    console.error('Recipe not found or update failed: No additional error information');
                    throw new Error('Recipe not found or update failed');
                }
                return transformRecipe(updatedRecipe);
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
                return transformRecipe(existingRecipe);
            }
            catch (error) {
                console.error('Error deleting recipe:', error);
                throw new Error('Error deleting recipe');
            }
        },
    }
};
exports.default = recipeResolvers;

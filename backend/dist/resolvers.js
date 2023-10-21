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
        users: async () => {
            try {
                const db = (0, database_1.getDb)();
                const users = await db.collection('users').find().toArray();
                return users.map(user => ({
                    ...user,
                    id: user._id.toString(),
                }));
            }
            catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Error fetching users');
            }
        },
        user: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(args.id) });
                if (!user) {
                    console.error('User not found');
                    throw new Error('User not found');
                }
                return {
                    ...user,
                    id: user._id.toString(),
                };
            }
            catch (error) {
                console.error('Error fetching user:', error);
                throw new Error('Error fetching user');
            }
        }
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
                console.log('Args:', args);
                const updateArgs = { ...args };
                delete updateArgs.id; // Remove the id from the arguments as we don't want to update it
                const result = await db.collection('recipes').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                console.log('Result:', result);
                if (!result) {
                    console.log(`Recipe not found for ID: ${args.id}`);
                    throw new Error('Recipe not found');
                }
                return result.value; // At this point, TypeScript should understand that result is not null
            }
            catch (error) {
                console.log('Specific error updating recipe:', error);
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
        addUser: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const result = await db.collection('users').insertOne(args.input);
                if (!result.insertedId) {
                    throw new Error('Failed to insert user');
                }
                const newUser = await db.collection('users').findOne({ _id: result.insertedId });
                if (!newUser) {
                    throw new Error('Inserted user not found');
                }
                return {
                    ...newUser,
                    id: newUser._id.toString(),
                };
            }
            catch (error) {
                console.error('Error adding user:', error);
                throw new Error('Error adding user');
            }
        },
        updateUser: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const updateArgs = { ...args.input };
                const result = await db.collection('users').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                if (!result || !result.value) {
                    throw new Error('User not found');
                }
                return {
                    ...result.value,
                    id: result.value._id.toString(),
                };
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Error updating user');
            }
        },
        deleteUser: async (_, args) => {
            try {
                const db = (0, database_1.getDb)();
                const userId = new mongodb_1.ObjectId(args.id);
                const existingUser = await db.collection('users').findOne({ _id: userId });
                if (!existingUser) {
                    throw new Error('User not found');
                }
                await db.collection('users').findOneAndDelete({ _id: userId });
                return {
                    ...existingUser,
                    id: existingUser._id.toString(),
                };
            }
            catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Error deleting user');
            }
        }
    }
};
exports.default = resolvers;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const mongodb_1 = require("mongodb");
const validation_1 = require("../../util/validation");
const transformUser = (user) => ({
    ...user,
    id: user._id.toString(),
});
function isWithId(obj) {
    return obj && obj._id !== undefined;
}
const userResolvers = {
    Query: {
        users: async () => {
            try {
                const db = (0, database_1.getDb)();
                const users = await db.collection('users').find().toArray();
                return users.map(transformUser);
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
                return transformUser(user);
            }
            catch (error) {
                console.error('Error fetching user:', error);
                throw new Error('Error fetching user');
            }
        },
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                await validation_1.UserInputSchema.validate(args.input);
                const db = (0, database_1.getDb)();
                const result = await db.collection('users').insertOne(args.input);
                if (!result.insertedId) {
                    throw new Error('Failed to insert user');
                }
                const newUser = await db.collection('users').findOne({ _id: result.insertedId });
                if (!newUser) {
                    throw new Error('Inserted user not found');
                }
                return transformUser(newUser);
            }
            catch (error) {
                console.error('Error adding user:', error);
                throw new Error('Error adding user');
            }
        },
        updateUser: async (_, args) => {
            try {
                await validation_1.UserInputSchema.validate(args.input);
                const db = (0, database_1.getDb)();
                const updateArgs = { ...args.input };
                const result = await db.collection('users').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                const updatedUser = result?.value || result;
                if (!isWithId(updatedUser)) {
                    console.error('User not found or update failed: No additional error information');
                    throw new Error('User not found or update failed');
                }
                return transformUser(updatedUser);
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
                return transformUser(existingUser);
            }
            catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Error deleting user');
            }
        },
    }
};
exports.default = userResolvers;

import { getDb } from '../database';
import { ObjectId } from 'mongodb';

const userResolvers = {
  Query: {
    users: async () => {
        try {
            const db = getDb();
            const users = await db.collection('users').find().toArray();
            console.log('Users fetched:', users);  // Log statement
            return users.map(user => ({
                ...user,
                id: user._id.toString(),
            }));
        } catch (error) {
            console.error('Error fetching users:', error);
            throw new Error('Error fetching users');
        }
    },

    user: async (_: any, args: any) => {
        try {
        const db = getDb();
        const user = await db.collection('users').findOne({ _id: new ObjectId(args.id) });
    
        if (!user) {
            console.error('User not found');
            throw new Error('User not found');
        }
    
        return {
            ...user,
            id: user._id.toString(),
        };
        } catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Error fetching user');
        }
    },
  },
  Mutation: { 
    addUser: async (_: any, args: any) => {
      console.log(args); 
      try {
        const db = getDb();  
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
      } catch (error) {
        console.error('Error adding user:', error);  
        throw new Error('Error adding user');
      }
    },

    updateUser: async (_: any, args: any) => {
        try {
            const db = getDb();
            const updateArgs = { ...args.input };
    
            const result = await db.collection('users').findOneAndUpdate(
                { _id: new ObjectId(args.id) },
                { $set: updateArgs },
                { returnDocument: 'after' }
            );
    
            const updatedUser = result.value || result;
            if (!updatedUser) {
                console.error('User not found or update failed: No additional error information');
                throw new Error('User not found or update failed');
            }
    
            return {
                ...updatedUser,
                id: updatedUser._id.toString(),
            };
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error('Error updating user');
        }
    },

    deleteUser: async (_: any, args: any) => {
      try {
        const db = getDb();
        const userId = new ObjectId(args.id);

        const existingUser = await db.collection('users').findOne({ _id: userId });
    
        if (!existingUser) {
          throw new Error('User not found');
        }
    
        await db.collection('users').findOneAndDelete({ _id: userId });

        return {
          ...existingUser,
          id: existingUser._id.toString(),
        };
      } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
      }
    },
  }
};

export default userResolvers;
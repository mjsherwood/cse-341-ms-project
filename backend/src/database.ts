import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Handling MongoDB connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});

export default db;
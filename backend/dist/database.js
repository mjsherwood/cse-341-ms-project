"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let db;
const MONGO_URI = process.env.MONGODB_URI || '';
if (!MONGO_URI) {
    console.error('Missing MONGODB_URI');
}
else {
    console.log('Connecting to MongoDB');
}
const initDb = async () => {
    if (db) {
        console.log('DB is already initialized!');
        return db;
    }
    try {
        const client = await mongodb_1.MongoClient.connect(MONGO_URI);
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
exports.initDb = initDb;
const getDb = () => {
    if (!db) {
        console.error('DB not initialized');
        throw new Error('Db not initialized');
    }
    return db;
};
exports.getDb = getDb;

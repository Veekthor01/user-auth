import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const client = new MongoClient(mongoURI);
let dbInstance = null;

export async function connectToDB () {
    try {
        if (!dbInstance) {
            await client.connect();
            dbInstance = client.db();
            console.log("Connected to MongoDB");
        };
            return dbInstance();
    } catch (err) {
        console.error("MongoDB connection error", err);
        throw err;
    };
};
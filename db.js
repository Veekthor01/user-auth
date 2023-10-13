const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoURI = process.env.MONGODB_URI;

const client = new MongoClient(mongoURI);
let dbInstance = null;

async function connectToDB () {
    try {
        if (!dbInstance) {
            await client.connect();
            dbInstance = client.db();
            console.log("Connected to MongoDB");
        };
            return dbInstance;
    } catch (err) {
       console.error("MongoDB connection error", err);
        throw err;
    };
};

async function closeDBConnection() {
    try {
        await client.close();
       console.log("Closed MongoDB connection");
    }
    catch (err) {
      console.error("MongoDB close connection error", err);
        throw err;
    }
}

module.exports = { connectToDB, closeDBConnection };

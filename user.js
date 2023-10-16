const { connectToDB } = require('./db');
const { ObjectId } = require('mongodb');
require('./passport-config/passport');

// Function to save a new user to the database
async function saveUser(newUser) {
    const db = await connectToDB();
    const usersCollection = db.collection('user');
    try {
      const result = await usersCollection.insertOne(newUser);
        return result;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

// Function to get a user by email from the database
async function getUserByEmail(email) {
    const db = await connectToDB();
    const usersCollection = db.collection('user');
    try {
        const user = await usersCollection.findOne({ email: email });
        return user;
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
};

// Function to get a user by ID from the database
async function getUserById(id) {
  const db = await connectToDB();
  const usersCollection = db.collection('user');
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        return user;
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};  

module.exports = { 
  saveUser, 
  getUserByEmail,
  getUserById
  };

  
  
  
  
  
  
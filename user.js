const bcrypt = require('bcrypt');
const { connectToDB } = require('./db');
const { ObjectId } = require('mongodb');
require('./passport-config/passport');

// Function to save a new user to the database
async function saveUser(newUser) {
    const db = await connectToDB();
    const usersCollection = db.collection('user');
    try {
      // Insert the new user document into the users collection
      const result = await usersCollection.insertOne(newUser);
        // Return the newly saved user
        return result;
    } catch (error) {
      // Handle the error, e.g., log it or return an error response
      //console.error('Error saving user:', error);
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
        //console.error('Error getting user by email:', error);
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
       // console.error('Error getting user by ID:', error);
        throw error;
    }
};

// Function to validate a user's password
async function validatePassword(user, password) {
    if (!user) {
      return false; // User not found
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    return passwordMatch;
  };  

module.exports = { 
  saveUser, 
  getUserByEmail,
  getUserById,
  validatePassword
  };

  
  
  
  
  
  
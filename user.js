import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { connectToDB } from './db.js';
import "./passport.js";

// Function to save a new user to the database
export async function saveUser(newUser) {
    const db = await connectToDB();
    const usersCollection = db.collection('user');
    try {
      // Insert the new user document into the users collection
      const result = await usersCollection.insertOne(newUser);
        // Return the newly saved user
        return result;
    } catch (error) {
      // Handle the error, e.g., log it or return an error response
      console.error('Error saving user:', error);
      throw error;
    }
  }

// Function to get a user by ID from the database
export async function getUserById(id) {
  const db = await connectToDB();
  const usersCollection = db.collection('user');
  const user = await usersCollection.findOne({ _id: new ObjectId(id) });
  return user;
}

// Function to get a user by email from the database
export async function getUserByEmail(email) {
  const db = await connectToDB();
  const usersCollection = db.collection('user');
  const user = await usersCollection.findOne({ email: email });
  return user;
}

// Function to validate a user's password
export async function validatePassword(user, password) {
  if (!user) {
    return false; // User not found
  }
  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  return passwordMatch;
}

  
  
  
  
  
  
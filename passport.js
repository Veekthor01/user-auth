import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserById, getUserByEmail, saveUser } from './user.js';

// Function to generate a password hash
async function generateHash(password) {
  const saltRounds = 10; // You can adjust the number of salt rounds for security
  return await bcrypt.hash(password, saltRounds);
}

// Local authentication strategy for signup (username/password)
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // Allows passing additional data to the callback
    },
    async (req, email, password, done) => {
      try {
        const user = await getUserByEmail(email);
        if (user) {
          return done(null, false, { message: 'Email is already taken.' });
        }
        const hashedPassword = await generateHash(password);
        const newUser = {
          email: email,
          password: hashedPassword,
        };
        // Save the new user to your database
        const savedUser = await saveUser(newUser);
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Local authentication strategy (username/password)
passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialization and deserialization functions to store user data in sessions
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });  

export default passport;

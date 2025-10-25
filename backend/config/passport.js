const passport = require('passport');
let GoogleStrategy, AppleStrategy;

try {
  GoogleStrategy = require('passport-google-oauth20').Strategy;
} catch (error) {
  console.warn('passport-google-oauth20 not installed, Google OAuth will not be available');
}

try {
  AppleStrategy = require('passport-apple');
} catch (error) {
  console.warn('passport-apple not installed, Apple OAuth will not be available');
}

// Mock User model if database is not available
let User;
try {
  User = require('../models/User');
} catch (error) {
  console.warn('User model not available, using mock user for OAuth');
  User = {
    findOne: () => Promise.resolve(null),
    prototype: {
      save: () => Promise.resolve()
    }
  };
}

// Configure Google OAuth Strategy
if (GoogleStrategy && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5002'}/api/auth/google/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // Update user's Google ID if not already set
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user or mock user if database is not available
      if (typeof User.create === 'function') {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: 'student', // Default role
          verified: true // Auto-verify OAuth users
        });
      } else {
        // Mock user for testing without database
        user = {
          _id: 'mock-id',
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: 'student',
          verified: true,
          generateToken: () => 'mock-token'
        };
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.log('Google OAuth not configured - skipping Google Strategy');
}

// Configure Apple OAuth Strategy
if (AppleStrategy && process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY_LOCATION) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5002'}/api/auth/apple/callback`,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple profile might not have email every time, so we extract from idToken
      const email = idToken.email || (profile && profile.email);
      
      if (!email) {
        return done(new Error('No email provided from Apple'), null);
      }
      
      // Check if user already exists
      let user = await User.findOne({ email });
      
      if (user) {
        // Update user's Apple ID if not already set
        if (!user.appleId && idToken.sub) {
          user.appleId = idToken.sub;
          await user.save();
        }
        return done(null, user);
      }
      
      // Create new user or mock user if database is not available
      if (typeof User.create === 'function') {
        user = await User.create({
          name: idToken.name || 'Apple User', // Apple might not provide name
          email,
          appleId: idToken.sub,
          role: 'student', // Default role
          verified: true // Auto-verify OAuth users
        });
      } else {
        // Mock user for testing without database
        user = {
          _id: 'mock-id',
          name: idToken.name || 'Apple User',
          email,
          appleId: idToken.sub,
          role: 'student',
          verified: true,
          generateToken: () => 'mock-token'
        };
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
} else {
  console.log('Apple OAuth not configured - skipping Apple Strategy');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
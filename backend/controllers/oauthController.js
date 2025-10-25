const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Handle user authentication via OAuth providers
 * This function is called by Passport.js strategies
 */
exports.handleOAuthUser = async (profile, provider) => {
  try {
    // Check if user already exists with this OAuth ID
    let user = await User.findOne({ 
      oauthId: profile.id,
      oauthProvider: provider 
    });

    if (!user) {
      // Check if user exists with the same email
      user = await User.findOne({ email: profile.email });
      
      if (user) {
        // Update existing user with OAuth info
        user.oauthId = profile.id;
        user.oauthProvider = provider;
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName || profile.name || 'User',
          email: profile.email,
          oauthId: profile.id,
          oauthProvider: provider,
          role: 'student', // Default role
          active: true
        });
      }
    }

    return user;
  } catch (error) {
    console.error(`OAuth ${provider} authentication error:`, error);
    throw error;
  }
};

/**
 * Generate JWT token for authenticated user
 */
exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};
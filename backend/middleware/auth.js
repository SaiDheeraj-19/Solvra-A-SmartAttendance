const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m' // Short-lived token for security
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key', {
    expiresIn: '7d' // Longer-lived token for refresh
  });
};

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // Check for token in Authorization header
    let token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          code: 'AUTH_NO_TOKEN'
        }
      });
    }

    token = token.split(' ')[1];

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user ID from token (handle both 'id' and 'userId' for backward compatibility)
      const userId = decoded.id || decoded.userId;
      
      // Get user from database
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: {
            message: 'User not found or deleted.',
            code: 'AUTH_USER_NOT_FOUND'
          }
        });
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      // Check if token expired
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: {
            message: 'Token expired. Please refresh your token.',
            code: 'AUTH_TOKEN_EXPIRED'
          }
        });
      }
      
      return res.status(401).json({ 
        success: false,
        error: {
          message: 'Invalid token.',
          code: 'AUTH_INVALID_TOKEN'
        }
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false,
      error: {
        message: 'Internal server error during authentication.',
        code: 'AUTH_SERVER_ERROR'
      }
    });
  }
};

// Middleware to refresh access token
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ 
      success: false,
      error: {
        message: 'Refresh token not provided.',
        code: 'AUTH_NO_REFRESH_TOKEN'
      }
    });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: {
          message: 'User not found or deleted.',
          code: 'AUTH_USER_NOT_FOUND'
        }
      });
    }
    
    // Generate new access token
    const accessToken = generateAccessToken(user._id);
    
    // Return new access token
    return res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      error: {
        message: 'Invalid refresh token.',
        code: 'AUTH_INVALID_REFRESH_TOKEN'
      }
    });
  }
};

// Export token generation functions
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;

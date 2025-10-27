require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const qrRoutes = require('./routes/qr');
const faceRoutes = require('./routes/face');
const adminFaceRoutes = require('./routes/adminFace');
const adminGeofenceRoutes = require('./routes/adminGeofence');
const marksRoutes = require('./routes/marks');
const timetableRoutes = require('./routes/timetable');
const testRoutes = require('./routes/test');

const app = express();

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Redis client setup for caching
let redisClient;
if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });
  redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
  });
  // Make Redis client available throughout the app
  app.set('redis', redisClient);
}

// Performance monitoring middleware with enhanced logging
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || Math.random().toString(36).substring(2, 15);
  
  // Add request ID to response headers for tracking
  res.setHeader('X-Request-ID', requestId);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.headers['x-forwarded-for'],
      timestamp: new Date().toISOString()
    };
    
    console.log(JSON.stringify(logData));
    
    // Log slow requests (over 1000ms)
    if (duration > 1000) {
      console.warn(`SLOW REQUEST: ${JSON.stringify(logData)}`);
    }
  });
  next();
};

// Middleware
app.use(performanceMiddleware); // Track request performance
app.use(morgan('combined', { stream: accessLogStream })); // HTTP request logger
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3010'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(cookieParser()); // Parse cookies
// app.use(mongoSanitize()); // Disabled: Not compatible with Express 5 - validation handled at route level
// app.use(xss()); // Disabled: Not compatible with Express 5 - XSS prevention handled at route level
app.use(hpp()); // Prevent HTTP parameter pollution

// Rate limiting with different tiers for different endpoints
const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased limit for development
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after an hour'
});

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  try {
    connectDB();
    // Load runtime geofence from DB (best effort)
    const geofenceService = require('./services/geofenceService');
    geofenceService.loadFromDb().catch(err => console.warn('Geofence load failed:', err.message));
  } catch (error) {
    console.warn('MongoDB connection failed, continuing without database:', error.message);
  }
}

// Create HTTP server and bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3010'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Store io in app locals for controllers to emit
app.set('io', io);

// Enhanced Socket.IO implementation with rooms and events
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Join role-based rooms (student, faculty, admin)
  socket.on('join-role', (role) => {
    if (['student', 'faculty', 'admin'].includes(role)) {
      socket.join(role);
      console.log(`Client ${socket.id} joined ${role} room`);
    }
  });
  
  // Join class-specific rooms
  socket.on('join-class', (classId) => {
    if (classId) {
      socket.join(`class-${classId}`);
      console.log(`Client ${socket.id} joined class-${classId} room`);
    }
  });
  
  // Join course-specific rooms
  socket.on('join-course', (courseId) => {
    if (courseId) {
      socket.join(`course-${courseId}`);
      console.log(`Client ${socket.id} joined course-${courseId} room`);
    }
  });
  
  // Join attendance session rooms
  socket.on('join-session', (sessionId) => {
    if (sessionId) {
      socket.join(`session-${sessionId}`);
      console.log(`Client ${socket.id} joined session-${sessionId} room`);
      
      // Notify room that a new user joined
      socket.to(`session-${sessionId}`).emit('user-joined', { socketId: socket.id });
    }
  });
  
  // Handle client disconnection
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
  
  // Error handling for socket
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Routes - Apply rate limiting to all API routes
// For development, we can bypass rate limiting to avoid issues during testing
if (process.env.NODE_ENV === 'development') {
  app.use('/api/auth', authRoutes);
} else {
  app.use('/api/auth', authLimiter, authRoutes);
}
app.use('/api/attendance', standardLimiter, attendanceRoutes);
app.use('/api/qr', standardLimiter, qrRoutes);
app.use('/api/face', standardLimiter, faceRoutes);
app.use('/api/admin/face', standardLimiter, adminFaceRoutes);
app.use('/api/admin/geofence', standardLimiter, adminGeofenceRoutes);
app.use('/api/marks', standardLimiter, marksRoutes);
app.use('/api/timetable', standardLimiter, timetableRoutes);
app.use('/api/test', testRoutes); // No rate limit on test routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  });
});

// Global error handling middleware with enhanced logging
app.use((err, req, res, next) => {
  const errorId = Math.random().toString(36).substring(2, 15);
  
  // Log detailed error information
  console.error(`[ERROR ${errorId}] Global error handler caught:`, {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Structured error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'SERVER_ERROR',
      errorId, // Include error ID for tracking
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    timestamp: new Date().toISOString()
  });
});
app.get('/', (req, res) => res.send('Smart Attendance API running'));

// Start server
const PORT = process.env.PORT || 5005; // Changed to 5005 to avoid port conflicts
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

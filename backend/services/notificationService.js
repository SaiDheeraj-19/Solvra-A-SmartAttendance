/**
 * Notification Service
 * Handles all notification-related functionality for the SmartAttendance system
 */

const User = require('../models/User');

class NotificationService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Send real-time notification to specific user
   * @param {string} userId - User ID to send notification to
   * @param {object} notification - Notification data
   */
  async sendToUser(userId, notification) {
    try {
      // Emit to user's personal channel
      this.io.to(`user-${userId}`).emit('notification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      // Store notification in database if needed
      // This could be implemented with a Notification model
      
      return true;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      return false;
    }
  }

  /**
   * Send notification to all users with a specific role
   * @param {string} role - Role (student, faculty, admin)
   * @param {object} notification - Notification data
   */
  async sendToRole(role, notification) {
    try {
      // Emit to role-based room
      this.io.to(role).emit('notification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error(`Error sending notification to ${role}:`, error);
      return false;
    }
  }

  /**
   * Send notification to all users in a specific class
   * @param {string} classId - Class ID
   * @param {object} notification - Notification data
   */
  async sendToClass(classId, notification) {
    try {
      // Emit to class-specific room
      this.io.to(`class-${classId}`).emit('notification', {
        ...notification,
        timestamp: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error(`Error sending notification to class ${classId}:`, error);
      return false;
    }
  }

  /**
   * Send attendance update notification
   * @param {string} userId - User ID
   * @param {string} sessionId - Attendance session ID
   * @param {string} status - Attendance status (present, absent, late)
   * @param {string} courseName - Course name
   */
  async sendAttendanceUpdate(userId, sessionId, status, courseName) {
    const statusMessages = {
      present: 'You have been marked present',
      absent: 'You have been marked absent',
      late: 'You have been marked late'
    };
    
    const notification = {
      type: 'attendance',
      title: 'Attendance Update',
      message: `${statusMessages[status] || 'Your attendance has been updated'} for ${courseName}`,
      data: {
        sessionId,
        status,
        courseName
      },
      priority: status === 'absent' ? 'high' : 'medium'
    };
    
    return this.sendToUser(userId, notification);
  }

  /**
   * Send session start notification to all students in a class
   * @param {string} classId - Class ID
   * @param {string} sessionId - Attendance session ID
   * @param {string} courseName - Course name
   * @param {string} facultyName - Faculty name
   * @param {number} duration - Session duration in minutes
   */
  async sendSessionStartNotification(classId, sessionId, courseName, facultyName, duration) {
    const notification = {
      type: 'session_start',
      title: 'Attendance Session Started',
      message: `${courseName} attendance session has started with ${facultyName}. Duration: ${duration} minutes.`,
      data: {
        sessionId,
        courseName,
        facultyName,
        duration
      },
      priority: 'high'
    };
    
    return this.sendToClass(classId, notification);
  }

  /**
   * Send session end notification to all students in a class
   * @param {string} classId - Class ID
   * @param {string} sessionId - Attendance session ID
   * @param {string} courseName - Course name
   */
  async sendSessionEndNotification(classId, sessionId, courseName) {
    const notification = {
      type: 'session_end',
      title: 'Attendance Session Ended',
      message: `${courseName} attendance session has ended.`,
      data: {
        sessionId,
        courseName
      },
      priority: 'medium'
    };
    
    return this.sendToClass(classId, notification);
  }

  /**
   * Send low attendance warning to a student
   * @param {string} userId - User ID
   * @param {string} courseName - Course name
   * @param {number} attendancePercentage - Current attendance percentage
   * @param {number} threshold - Attendance threshold percentage
   */
  async sendLowAttendanceWarning(userId, courseName, attendancePercentage, threshold) {
    const notification = {
      type: 'attendance_warning',
      title: 'Low Attendance Warning',
      message: `Your attendance in ${courseName} is ${attendancePercentage}%, which is below the required ${threshold}%.`,
      data: {
        courseName,
        attendancePercentage,
        threshold
      },
      priority: 'high'
    };
    
    return this.sendToUser(userId, notification);
  }
}

module.exports = NotificationService;
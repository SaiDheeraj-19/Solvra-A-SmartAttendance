import api from './authService';

export const attendanceService = {
  // QR Code operations
  generateQR: (sessionData) => api.post('/qr/generate', sessionData),
  validateQR: (qrData) => api.post('/qr/validate', qrData),
  
  // Attendance operations
  markAttendance: (attendanceData) => api.post('/attendance/mark', attendanceData),
  getAttendanceHistory: (filters) => api.get('/attendance/history', { params: filters }),
  getAttendanceStats: () => api.get('/attendance/stats'),
  getSessionAttendance: (sessionId) => api.get(`/attendance/session/${sessionId}`),
  
  // Face verification
  verifyFace: (faceData) => api.post('/face/verify', faceData),
  registerFace: (faceData) => api.post('/face/register', faceData),
  
  // Admin face management
  uploadStudentFace: (studentId, faceData) => api.post('/admin/face/upload', { studentId, faceData }),
  getStudentFaces: () => api.get('/admin/face/students'),
  deleteStudentFace: (studentId) => api.delete(`/admin/face/students/${studentId}`),
  
  // Timetable operations
  getTimetable: (filters) => api.get('/timetable', { params: filters }),
  createTimetableEntry: (entryData) => api.post('/timetable', entryData),
  updateTimetableEntry: (id, entryData) => api.put(`/timetable/${id}`, entryData),
  deleteTimetableEntry: (id) => api.delete(`/timetable/${id}`)
};
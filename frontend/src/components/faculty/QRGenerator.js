import React, { useState, useEffect } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { QrCode, Clock, Users, Download, RefreshCw, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const QRGenerator = () => {
  const [sessionData, setSessionData] = useState({
    subject: '',
    class: '',
    duration: 60, // minutes
    description: ''
  });
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [showQRData, setShowQRData] = useState(false);

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const classes = [
    'CSE-A-2024',
    'CSE-B-2024',
    'ECE-A-2024',
    'ECE-B-2024',
    'ME-A-2024',
    'CE-A-2024'
  ];

  useEffect(() => {
    // Check for active sessions on component mount
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      // This would typically fetch active sessions from the backend
      // For now, we'll check localStorage for any active session
      const savedSession = localStorage.getItem('activeSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const now = new Date();
        const sessionEnd = new Date(session.expiresAt);
        
        if (now < sessionEnd) {
          setActiveSession(session);
          setQrCode(session.qrCode);
        } else {
          localStorage.removeItem('activeSession');
        }
      }
    } catch (error) {
      console.error('Error checking active session:', error);
    }
  };

  const handleInputChange = (e) => {
    setSessionData({
      ...sessionData,
      [e.target.name]: e.target.value
    });
  };

  const generateQR = async () => {
    if (!sessionData.subject || !sessionData.class) {
      toast.error('Please select subject and class');
      return;
    }

    setLoading(true);
    try {
      const response = await attendanceService.generateQR({
        ...sessionData,
        expiresIn: sessionData.duration * 60 // convert to seconds
      });

      const newSession = {
        ...response.data,
        expiresAt: new Date(Date.now() + sessionData.duration * 60 * 1000).toISOString()
      };

      setQrCode(response.data.qrCode);
      setActiveSession(newSession);
      
      // Save to localStorage for persistence
      localStorage.setItem('activeSession', JSON.stringify(newSession));
      
      toast.success('QR Code generated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const endSession = () => {
    setQrCode(null);
    setActiveSession(null);
    localStorage.removeItem('activeSession');
    toast.success('Session ended successfully');
  };

  const downloadQR = () => {
    if (!qrCode) return;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${sessionData.subject}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRemainingTime = () => {
    if (!activeSession) return null;
    
    const now = new Date();
    const end = new Date(activeSession.expiresAt);
    const remaining = Math.max(0, Math.floor((end - now) / 1000));
    
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Generate QR Code</h3>
        <p className="text-sm text-gray-600">
          Create a QR code for students to mark their attendance
        </p>
      </div>

      {!activeSession ? (
        // QR Generation Form
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <select
                name="subject"
                value={sessionData.subject}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class *
              </label>
              <select
                name="class"
                value={sessionData.class}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={sessionData.duration}
                onChange={handleInputChange}
                className="input"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={sessionData.description}
                onChange={handleInputChange}
                placeholder="Optional description"
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={generateQR}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <QrCode className="h-5 w-5" />
              )}
              <span>{loading ? 'Generating...' : 'Generate QR Code'}</span>
            </button>
          </div>
        </div>
      ) : (
        // Active Session Display
        <div className="space-y-6">
          {/* Session Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-green-900">Active Session</h4>
              <div className="flex items-center space-x-2 text-green-700">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{getRemainingTime()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-900">Subject:</span>
                <p className="text-green-700">{activeSession.subject}</p>
              </div>
              <div>
                <span className="font-medium text-green-900">Class:</span>
                <p className="text-green-700">{activeSession.class}</p>
              </div>
              <div>
                <span className="font-medium text-green-900">Duration:</span>
                <p className="text-green-700">{sessionData.duration} minutes</p>
              </div>
              <div>
                <span className="font-medium text-green-900">Session ID:</span>
                <p className="text-green-700 font-mono">{activeSession.sessionId?.slice(-8)}</p>
              </div>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              QR Code for Students
            </h4>
            
            {qrCode && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="Attendance QR Code"
                    className="w-64 h-64 border border-gray-300 rounded-lg"
                  />
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={downloadQR}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  
                  <button
                    onClick={() => setShowQRData(!showQRData)}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    {showQRData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span>{showQRData ? 'Hide' : 'Show'} Data</span>
                  </button>
                </div>

                {showQRData && (
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <p className="text-sm font-medium text-gray-700 mb-2">QR Code Data:</p>
                    <code className="text-xs text-gray-600 break-all">
                      {activeSession.qrData}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Session Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={generateQR}
              disabled={loading}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate QR</span>
            </button>
            
            <button
              onClick={endSession}
              className="btn btn-danger flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>End Session</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Instructions for Students:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Ensure you are within the campus area</li>
              <li>2. Scan the QR code or enter the code manually</li>
              <li>3. Complete face verification when prompted</li>
              <li>4. Your attendance will be marked automatically</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;
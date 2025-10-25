import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { attendanceService } from '../../services/attendanceService';
import { getCurrentLocation, isWithinGeofence } from '../../utils/geolocation';
import { Camera, MapPin, CheckCircle, XCircle, Scan } from 'lucide-react';
import toast from 'react-hot-toast';

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [locationStatus, setLocationStatus] = useState('checking');
  const [qrData, setQrData] = useState('');
  const [step, setStep] = useState('location'); // location -> qr -> face -> success
  const [attendanceResult, setAttendanceResult] = useState(null);
  const webcamRef = useRef(null);
  const [faceCaptured, setFaceCaptured] = useState(false);

  // Campus coordinates (example - replace with actual coordinates)
  const CAMPUS_CENTER = { lat: 12.9716, lon: 77.5946 }; // Bangalore coordinates
  const CAMPUS_RADIUS = 500; // 500 meters

  const checkLocation = async () => {
    setLocationStatus('checking');
    try {
      const location = await getCurrentLocation();
      const withinGeofence = isWithinGeofence(
        location.latitude,
        location.longitude,
        CAMPUS_CENTER.lat,
        CAMPUS_CENTER.lon,
        CAMPUS_RADIUS
      );

      if (withinGeofence) {
        setLocationStatus('valid');
        setStep('qr');
        toast.success('Location verified! You can now scan QR code.');
      } else {
        setLocationStatus('invalid');
        toast.error('You are outside the campus area. Please move closer to campus.');
      }
    } catch (error) {
      setLocationStatus('error');
      toast.error(error.message || 'Failed to get location');
    }
  };

  const handleQRInput = async () => {
    if (!qrData.trim()) {
      toast.error('Please enter QR code data');
      return;
    }

    try {
      setScanning(true);
      const response = await attendanceService.validateQR({ qrData: qrData.trim() });
      
      if (response.data.valid) {
        setStep('face');
        toast.success('QR code validated! Now capture your face for verification.');
      } else {
        toast.error('Invalid or expired QR code');
      }
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'QR validation failed');
    } finally {
      setScanning(false);
    }
  };

  const captureFace = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      toast.error('Failed to capture image');
      return;
    }

    try {
      setScanning(true);
      setFaceCaptured(true);

      // Get current location for attendance marking
      const location = await getCurrentLocation();

      const attendanceData = {
        qrData: qrData.trim(),
        faceImage: imageSrc,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      };

      const response = await attendanceService.markAttendance(attendanceData);
      
      setAttendanceResult(response.data);
      setStep('success');
      toast.success('Attendance marked successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Face verification failed');
      setFaceCaptured(false);
    } finally {
      setScanning(false);
    }
  }, [qrData]);

  const resetProcess = () => {
    setStep('location');
    setLocationStatus('checking');
    setQrData('');
    setFaceCaptured(false);
    setAttendanceResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Mark Attendance</h3>
        <p className="text-sm text-gray-600">
          Follow the steps below to mark your attendance
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {['location', 'qr', 'face', 'success'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName ? 'bg-blue-600 text-white' :
              ['location', 'qr', 'face'].indexOf(step) > index ? 'bg-green-600 text-white' :
              'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < 3 && (
              <div className={`w-12 h-0.5 ${
                ['location', 'qr', 'face'].indexOf(step) > index ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Location Verification */}
      {step === 'location' && (
        <div className="text-center space-y-4">
          <div className="p-6 bg-blue-50 rounded-lg">
            <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Verify Location</h4>
            <p className="text-sm text-gray-600 mb-4">
              We need to verify that you are within the campus area
            </p>
            
            {locationStatus === 'checking' && (
              <button
                onClick={checkLocation}
                className="btn btn-primary"
              >
                Check Location
              </button>
            )}
            
            {locationStatus === 'invalid' && (
              <div className="space-y-2">
                <div className="flex items-center justify-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>Outside campus area</span>
                </div>
                <button
                  onClick={checkLocation}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {locationStatus === 'error' && (
              <div className="space-y-2">
                <div className="flex items-center justify-center text-red-600">
                  <XCircle className="h-5 w-5 mr-2" />
                  <span>Location access denied</span>
                </div>
                <button
                  onClick={checkLocation}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: QR Code Input */}
      {step === 'qr' && (
        <div className="space-y-4">
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Location verified</span>
            </div>
            
            <div className="text-center">
              <Scan className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Enter QR Code</h4>
              <p className="text-sm text-gray-600 mb-4">
                Scan the QR code displayed by your instructor or enter the code manually
              </p>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  placeholder="Enter QR code data"
                  className="input"
                />
                <button
                  onClick={handleQRInput}
                  disabled={scanning || !qrData.trim()}
                  className="btn btn-primary w-full"
                >
                  {scanning ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    'Validate QR Code'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Face Verification */}
      {step === 'face' && (
        <div className="space-y-4">
          <div className="p-6 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center text-green-600 mb-4">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>QR code validated</span>
            </div>
            
            <div className="text-center">
              <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Face Verification</h4>
              <p className="text-sm text-gray-600 mb-4">
                Position your face in the camera and click capture
              </p>
              
              <div className="space-y-4">
                <div className="relative mx-auto w-80 h-60 bg-gray-100 rounded-lg overflow-hidden">
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <button
                  onClick={captureFace}
                  disabled={scanning || faceCaptured}
                  className="btn btn-primary w-full"
                >
                  {scanning ? (
                    <div className="loading-spinner"></div>
                  ) : faceCaptured ? (
                    'Processing...'
                  ) : (
                    'Capture Face'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 'success' && attendanceResult && (
        <div className="space-y-4">
          <div className="p-6 bg-green-50 rounded-lg text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Attendance Marked!</h4>
            <p className="text-sm text-gray-600 mb-4">
              Your attendance has been successfully recorded
            </p>
            
            <div className="bg-white rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subject:</span>
                <span>{attendanceResult.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>{new Date(attendanceResult.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-medium">Present</span>
              </div>
            </div>
            
            <button
              onClick={resetProcess}
              className="btn btn-primary mt-4"
            >
              Mark Another Attendance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
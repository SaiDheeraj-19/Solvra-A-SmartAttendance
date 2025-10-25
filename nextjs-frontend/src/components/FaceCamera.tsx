'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FaceCameraProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  title?: string;
  instruction?: string;
}

export default function FaceCamera({ 
  onCapture, 
  onClose, 
  title = "Face Verification", 
  instruction = "Position your face in the frame and click the camera button" 
}: FaceCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Check for camera permissions and availability
  useEffect(() => {
    const checkCameraAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        setCameraError(null);
      } catch (err) {
        console.error('Camera access error:', err);
        setCameraError("Camera access denied or not available. Please check permissions and try again.");
      }
    };

    checkCameraAccess();
  }, []);

  const captureImage = () => {
    setCapturing(true);
    setError(null);
    
    try {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          // Convert to base64 data URL without the prefix for backend
          const base64Data = imageSrc.split(',')[1];
          onCapture(base64Data);
        } else {
          setError("Failed to capture image. Please try again.");
        }
      }
    } catch (err) {
      console.error('Capture error:', err);
      setError("An error occurred while capturing the image.");
    } finally {
      setCapturing(false);
    }
  };

  const videoConstraints = {
    width: 800,
    height: 600,
    facingMode: "user"
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="premium-card p-6 rounded-xl"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-subheader-md text-text-primary font-medium">{title}</h3>
        <button 
          onClick={onClose}
          className="text-text-secondary hover:text-bronze transition-colors"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {cameraError ? (
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          <div>
            <p className="text-body-md text-red-800 font-medium">Camera Error</p>
            <p className="text-body-sm text-red-700 mt-1">{cameraError}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
              onUserMediaError={(error) => {
                console.error('Webcam error:', error);
                setCameraError("Failed to access camera. Please check permissions and try again.");
              }}
            />
            <div className="absolute inset-0 border-4 border-accent-bronze rounded-lg pointer-events-none"></div>
            {/* Face guide overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="border-2 border-dashed border-accent-bronze rounded-full w-64 h-64 flex items-center justify-center">
                <Camera className="w-8 h-8 text-accent-bronze opacity-50" />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-body-md text-red-700">{error}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-col items-center">
            <button
              onClick={captureImage}
              disabled={capturing || !!cameraError}
              className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all ${
                capturing || !!cameraError
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-accent-bronze hover:bg-bronze cursor-pointer'
              }`}
              aria-label="Capture image"
            >
              {capturing ? (
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </button>
            
            <p className="text-body-md text-text-secondary text-center mt-3">
              {instruction}
            </p>
            
            <div className="mt-4 text-body-sm text-text-secondary text-center">
              <p>Position your face within the circular frame for best results</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
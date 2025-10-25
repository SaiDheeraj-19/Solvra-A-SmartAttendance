'use client';

import { useState, useEffect, useRef } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AutoQRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
  instruction?: string;
}

export default function AutoQRScanner({ 
  onScan, 
  onClose, 
  title = "QR Code Scanner", 
  instruction = "Position QR code in frame for automatic scanning" 
}: AutoQRScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Handle successful scan
  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes.length > 0 && scanning) {
      const result = detectedCodes[0].rawValue;
      setScanning(false);
      setScanResult(result);
      onScan(result);
    }
  };

  // Handle scan errors
  const handleError = (err: any) => {
    console.error('QR Scanner error:', err);
    if (err.name === 'NotAllowedError') {
      setCameraError("Camera access denied. Please enable camera permissions.");
    } else if (err.name === 'NotFoundError') {
      setCameraError("No camera found on this device.");
    } else {
      setCameraError("Failed to access camera. Please try again.");
    }
  };

  // Reset scanner
  const resetScanner = () => {
    setScanning(true);
    setScanResult(null);
    setError(null);
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
          aria-label="Close scanner"
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
            {scanning ? (
              <Scanner
                onScan={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
                components={{
                  finder: true,
                  torch: true
                }}
                scanDelay={500}
                classNames={{
                  container: "w-full h-full"
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-body-md text-green-800 font-medium">QR Code Scanned Successfully!</p>
                </div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-body-md text-red-700">{error}</p>
            </div>
          )}
          
          <div className="mt-4 flex flex-col items-center">
            {scanning ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-accent-bronze animate-spin" />
                <p className="text-body-md text-text-secondary">
                  {instruction}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-body-md text-green-700 font-medium">
                  Scanned: {scanResult?.substring(0, 30)}{scanResult && scanResult.length > 30 ? '...' : ''}
                </p>
                <button
                  onClick={resetScanner}
                  className="premium-button primary px-4 py-2 rounded-full text-label mt-3"
                >
                  Scan Another Code
                </button>
              </div>
            )}
            
            <div className="mt-4 text-body-sm text-text-secondary text-center">
              <p>Hold your device so the QR code is visible in the frame</p>
              <p className="mt-1">Scanning will happen automatically</p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
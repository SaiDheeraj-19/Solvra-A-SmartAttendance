'use client';

import { useEffect } from 'react';

export default function LoadingScreen() {
  useEffect(() => {
    // Add a class to body to prevent scrolling during loading
    document.body.classList.add('overflow-hidden');
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-primary-bg flex items-center justify-center z-50">
      <div className="text-center">
        <div className="luxury-loader mx-auto mb-8"></div>
        <h2 className="text-header-md font-serif text-text-primary">Solvra</h2>
        <p className="text-body-md text-text-secondary mt-2">Loading precision...</p>
      </div>
    </div>
  );
}
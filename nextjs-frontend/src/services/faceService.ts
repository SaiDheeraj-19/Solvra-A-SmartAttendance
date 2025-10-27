// Face verification service
export const faceService = {
  // Verify face during attendance
  verifyFace: async (faceImageData: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/face/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ faceImage: faceImageData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Face verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Face verification error:', error);
      throw error;
    }
  },

  // Register face for a student
  registerFace: async (faceImageData: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/face/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ faceImage: faceImageData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Face registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Face registration error:', error);
      throw error;
    }
  },

  // Get face registration status
  getFaceStatus: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/face/status`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get face status');
      }

      return await response.json();
    } catch (error) {
      console.error('Get face status error:', error);
      throw error;
    }
  },

  // Update security settings
  updateSecuritySettings: async (securitySettings: { 
    requireFaceVerification?: boolean; 
    allowProxyAttendance?: boolean;
    maxVerificationAttempts?: number;
  }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api'}/face/security-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(securitySettings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update security settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Update security settings error:', error);
      throw error;
    }
  }
};
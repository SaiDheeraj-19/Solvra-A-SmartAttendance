const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

// Auth API functions
export const authAPI = {
  // Student registration
  registerStudent: async (userData: {
    name: string;
    email: string;
    password: string;
    studentId: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        role: 'student'
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Registration failed');
    }
    
    return response.json();
  },

  // Faculty registration
  registerFaculty: async (userData: {
    name: string;
    email: string;
    password: string;
    employeeId: string;
    department: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        studentId: userData.employeeId, // Backend uses studentId field for both
        role: 'faculty'
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Registration failed');
    }
    
    return response.json();
  },

  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Login failed');
    }
    
    return response.json();
  },

  // Logout
  logout: async () => {
    // For JWT-based auth, logout is typically handled client-side
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Optional: Call backend logout endpoint if one exists
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (_error) {
      // Ignore errors for logout
      console.log('Logout endpoint not available or failed');
    }
  },

  // Get current user profile
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Failed to get profile');
    }
    
    return response.json();
  }
};

// Utility functions
export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (_error) {
      return null;
    }
  }
  return null;
};

// Navigation function
export const redirectToLogin = () => {
  // Remove token and redirect to login
  setAuthToken('');
  window.location.href = '/login';
};

// Get user role and determine appropriate dashboard
export const getUserDashboardPath = (userRole: string) => {
  switch (userRole) {
    case 'student':
      return '/student';
    case 'faculty':
      return '/faculty';
    case 'hod':
    case 'dean':
      return '/admin';
    default:
      return '/student'; // Default fallback
  }
};
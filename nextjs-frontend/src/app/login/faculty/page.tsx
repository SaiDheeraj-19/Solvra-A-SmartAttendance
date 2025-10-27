'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, LogIn, Home, User, IdCard, School } from 'lucide-react';
import { authAPI, setAuthToken, getUserDashboardPath } from '@/services/api';

export default function FacultyLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    confirmPassword: '',
    name: '',
    employeeId: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Clear messages when switching modes
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [isRegistering]);

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (isRegistering) {
      if (!formData.name || !formData.employeeId || !formData.department) {
        setError('All fields are required');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return false;
      }

      // Employee ID validation (alphanumeric, 6-12 characters)
      const employeeIdRegex = /^[a-zA-Z0-9]{6,12}$/;
      if (!employeeIdRegex.test(formData.employeeId)) {
        setError('Employee ID must be 6-12 alphanumeric characters');
        return false;
      }

      // Department validation
      if (!formData.department) {
        setError('Please select a department');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }
    
    try {
      if (isRegistering) {
        const response = await authAPI.registerFaculty({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          employeeId: formData.employeeId,
          department: formData.department
        });
        
        setAuthToken(response.token);
        setSuccess('Faculty account created successfully! Redirecting...');
        
        // Small delay to show success message
        setTimeout(() => {
          router.push('/faculty');
        }, 1500);
      } else {
        const response = await authAPI.login(formData.email, formData.password);
        
        setAuthToken(response.token);
        setSuccess('Login successful! Redirecting...');
        
        // Get user profile to determine role and redirect appropriately
        try {
          const profile = await authAPI.getProfile();
          const dashboardPath = getUserDashboardPath(profile.role);
          
          // Small delay to show success message
          setTimeout(() => {
            router.push(dashboardPath);
          }, 1500);
        } catch (profileError) {
          console.log('Profile fetch failed, using fallback:', profileError);
          // Small delay to show success message
          setTimeout(() => {
            router.push('/faculty');
          }, 1500);
        }
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('Network error')) {
          setError('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (err.message.includes('401') || err.message.includes('Invalid credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (err.message.includes('already exists')) {
          setError('An account with this email or employee ID already exists. Please use a different email or employee ID.');
        } else if (err.message.includes('rate limit')) {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(err.message || 'Authentication failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccess('');
    // Reset form when toggling modes
    setFormData({ 
      email: '', 
      password: '',
      confirmPassword: '',
      name: '',
      employeeId: '',
      department: ''
    });
  };

  // Department options
  const departmentOptions = [
    { value: '', label: 'Select your department' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering' },
    { value: 'Civil Engineering', label: 'Civil Engineering' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Business Administration', label: 'Business Administration' },
    { value: 'Economics', label: 'Economics' },
    { value: 'English', label: 'English' },
  ];

  return (
    <main className="min-h-screen bg-primary-bg relative overflow-hidden flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="absolute inset-0 grid-background opacity-5" />
      <div className="absolute inset-0 spotlight" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Home className="w-6 h-6 text-bronze hover:text-text-primary" />
          </Link>
          <Link href="/">
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-serif font-bold text-text-primary mb-2 cursor-pointer">Solvra</h1>
              <p className="text-sm text-text-secondary italic">Intelligence that never misses a mark</p>
            </div>
          </Link>
          <p className="text-text-primary mt-4">
            {isRegistering ? 'Create your faculty account' : 'Faculty sign in'}
          </p>
        </div>

        <div className="premium-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl">
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
            >
              {success}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                      placeholder="Enter your full name"
                      required={isRegistering}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Employee ID</label>
                  <div className="relative">
                    <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                      placeholder="Enter your employee ID"
                      required={isRegistering}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Department</label>
                  <div className="relative">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full premium-input rounded-xl pl-12 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-bronze transition-colors appearance-none"
                      required={isRegistering}
                      disabled={loading}
                    >
                      {departmentOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full premium-input rounded-xl pl-12 pr-12 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze hover:text-text-primary"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {isRegistering && (
                <p className="mt-1 text-xs text-text-secondary">Minimum 6 characters</p>
              )}
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full premium-input rounded-xl pl-12 pr-12 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                    placeholder="Confirm your password"
                    required={isRegistering}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze hover:text-text-primary"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full premium-button primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRegistering ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : isRegistering ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Faculty Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Faculty Sign In
                </>
              )}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-bronze hover:text-text-primary font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isRegistering ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Already have an account? Sign in
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create faculty account
                </>
              )}
            </button>
            
            <Link 
              href="/" 
              className="text-bronze hover:text-text-primary font-medium flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
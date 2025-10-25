'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, LogIn, Home } from 'lucide-react';
import { authAPI, setAuthToken, getUserDashboardPath } from '@/services/api';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    name: '',
    studentId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        // Validate required fields for registration
        if (!formData.name || !formData.email || !formData.password || !formData.studentId) {
          throw new Error('All fields are required');
        }
        
        // Confirm password validation would go here
        
        const response = await authAPI.registerStudent({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          studentId: formData.studentId
        });
        
        setAuthToken(response.token);
        router.push('/student');
      } else {
        // Login
        if (!formData.email || !formData.password) {
          throw new Error('Email and password are required');
        }
        
        const response = await authAPI.login(formData.email, formData.password);
        
        setAuthToken(response.token);
        
        // Get user profile to determine role and redirect appropriately
        try {
          const profile = await authAPI.getProfile();
          const dashboardPath = getUserDashboardPath(profile.role);
          router.push(dashboardPath);
        } catch (_profileError) {
          // Fallback to student dashboard if profile fetch fails
          router.push('/student');
        }
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    // Reset form when toggling modes
    setFormData({ 
      email: '', 
      password: '',
      name: '',
      studentId: ''
    });
  };

  return (
    <main className="min-h-screen bg-primary-bg relative overflow-hidden flex items-center justify-center px-6">
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
            {isRegistering ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        <div className="premium-card p-8 rounded-3xl">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegistering && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                      placeholder="Enter your full name"
                      required={isRegistering}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Student ID</label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                      placeholder="Enter your student ID"
                      required={isRegistering}
                    />
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full premium-input rounded-xl pl-12 pr-12 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                    placeholder="Confirm your password"
                    required={isRegistering}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={toggleMode}
              className="text-bronze hover:text-text-primary font-medium flex items-center gap-2"
            >
              {isRegistering ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Already have an account? Sign in
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create new account
                </>
              )}
            </button>
            
            <Link href="/" className="text-bronze hover:text-text-primary font-medium flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, IdCard, School } from 'lucide-react';

export default function FacultyRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    facultyId: '', 
    department: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Faculty Registration:', formData);
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
          <Link href="/">
            <h1 className="text-4xl font-serif font-bold text-text-primary mb-2 cursor-pointer">Solvra</h1>
          </Link>
          <p className="text-text-primary">Create your faculty account</p>
        </div>

        <div className="premium-card p-8 rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-text-primary mb-2">Faculty ID</label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                <input
                  type="text"
                  value={formData.facultyId}
                  onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  className="w-full premium-input rounded-xl pl-12 pr-4 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                  placeholder="Enter your faculty ID"
                  required
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
                  className="w-full premium-input rounded-xl pl-12 pr-4 py-3 text-text-primary focus:outline-none focus:border-accent-bronze transition-colors"
                  required
                >
                  <option value="">Select your department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
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
                  placeholder="Create a password"
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

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bronze" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full premium-input rounded-xl pl-12 pr-12 py-3 placeholder-text-secondary focus:outline-none focus:border-accent-bronze transition-colors"
                  placeholder="Confirm your password"
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full premium-button primary py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group"
            >
              Create Faculty Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <p className="text-center text-text-primary mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-bronze hover:text-text-primary font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
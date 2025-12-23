'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { User, GraduationCap, Shield, LogIn, Users, Camera, MapPin, BarChart3 } from 'lucide-react';

export default function Home() {
  const portals = [
    {
      title: 'Student Portal',
      description: 'Attendance tracking, QR scanning, and performance insights',
      icon: User,
      href: '/login',
      role: 'student'
    },
    {
      title: 'Faculty Portal',
      description: 'Class management, QR generation, and attendance analytics',
      icon: GraduationCap,
      href: '/login/faculty',
      role: 'faculty'
    },
    {
      title: 'Admin Portal',
      description: 'System oversight, user management, and institutional analytics',
      icon: Shield,
      href: '/login/admin',
      role: 'admin'
    },
  ];

  return (
    <main className="min-h-screen bg-primary-bg relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(191, 164, 122, 0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="fade-in"
          >
            <h1 className="text-display-1 font-serif mb-6 tracking-tight text-text-primary">
              Solvra<br />
              <span className="text-bronze">Precision Attendance.</span>
            </h1>
            
            <p className="text-subheader-md text-text-primary mb-16 max-w-2xl mx-auto leading-relaxed">
              Reimagining Attendance with Precision.<br />
              <span className="text-body-md text-text-secondary">Geo-fence, Face ID, and AI-powered insights for modern institutions</span>
            </p>

            {/* Access Portals */}
            <div className="mb-16">
              <h2 className="text-header-md text-text-primary mb-8 font-serif">Access Your Portal</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 max-w-5xl mx-auto">
                {portals.map((portal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="scale-in"
                  >
                    <Link href={portal.href}>
                      <div className="premium-card p-8 rounded-xl group cursor-pointer h-full flex flex-col border-l-4 border-accent-bronze hover:shadow-xl transition-all">
                        <div className="w-16 h-16 rounded-full bg-primary card border border-primary flex items-center justify-center mb-6 mx-auto">
                          <portal.icon className="w-8 h-8 text-bronze" />
                        </div>
                        <h3 className="text-subheader-lg text-text-primary mb-3 font-medium">{portal.title}</h3>
                        <p className="text-body-md text-text-primary flex-grow">{portal.description}</p>
                        <div className="mt-6">
                          <span className="premium-button primary px-6 py-3 rounded-full text-label uppercase tracking-wider flex items-center justify-center gap-2">
                            <LogIn className="w-4 h-4" />
                            Access Portal
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="text-center mb-16">
              <p className="text-body-md text-text-primary">
                Each portal includes both login and registration options in one convenient interface
              </p>
            </div>
            
            {/* Role Information */}
            <div className="bg-primary-bg/50 rounded-2xl p-8 mb-16 border border-primary">
              <h2 className="text-header-md text-text-primary mb-6 font-serif">User Roles & Access Levels</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-bronze" />
                    <h3 className="text-subheader-sm text-text-primary font-medium">Student</h3>
                  </div>
                  <ul className="text-body-md text-text-secondary space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Attendance check-in/check-out</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>QR code scanning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Performance analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Face verification</span>
                    </li>
                  </ul>
                </div>
                
                <div className="premium-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-bronze" />
                    <h3 className="text-subheader-sm text-text-primary font-medium">Faculty</h3>
                  </div>
                  <ul className="text-body-md text-text-secondary space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Generate attendance QR codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Class management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Attendance reports</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Proxy attendance approval</span>
                    </li>
                  </ul>
                </div>
                
                <div className="premium-card p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-bronze" />
                    <h3 className="text-subheader-sm text-text-primary font-medium">Administrator</h3>
                  </div>
                  <ul className="text-body-md text-text-secondary space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>User account management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>System configuration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Face data administration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-bronze">•</span>
                      <span>Institutional analytics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-primary-bg/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-header-md text-text-primary text-center mb-12 font-serif">Powerful Administrative Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="premium-card p-6 rounded-xl text-center">
              <Users className="w-10 h-10 text-bronze mx-auto mb-4" />
              <h3 className="text-subheader-sm text-text-primary mb-2">User Management</h3>
              <p className="text-body-md text-text-secondary">Register and manage students, faculty, and administrators</p>
            </div>
            <div className="premium-card p-6 rounded-xl text-center">
              <Camera className="w-10 h-10 text-bronze mx-auto mb-4" />
              <h3 className="text-subheader-sm text-text-primary mb-2">Face Data Control</h3>
              <p className="text-body-md text-text-secondary">Manage biometric face registrations for all users</p>
            </div>
            <div className="premium-card p-6 rounded-xl text-center">
              <MapPin className="w-10 h-10 text-bronze mx-auto mb-4" />
              <h3 className="text-subheader-sm text-text-primary mb-2">Geofencing</h3>
              <p className="text-body-md text-text-secondary">Configure campus boundaries and attendance zones</p>
            </div>
            <div className="premium-card p-6 rounded-xl text-center">
              <BarChart3 className="w-10 h-10 text-bronze mx-auto mb-4" />
              <h3 className="text-subheader-sm text-text-primary mb-2">Analytics</h3>
              <p className="text-body-md text-text-secondary">Access comprehensive institutional attendance analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-body-md text-text-primary">
            © {new Date().getFullYear()} Solvra — All Rights Reserved
          </p>
          <div className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-bronze">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span className="text-body-md text-text-primary">Contact:</span>
            <a href="mailto:solvraattendance@gmail.com" className="text-body-md text-bronze hover:text-text-primary transition-colors">
              solvraattendance@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
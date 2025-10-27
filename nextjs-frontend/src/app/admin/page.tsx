'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Camera, Settings, BarChart3, Shield, TrendingUp, UserPlus, Search, MapPin, LogOut, Plus, X } from 'lucide-react';
import Webcam from 'react-webcam';
import { authAPI, redirectToLogin } from '@/services/api';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [geofenceSettings, setGeofenceSettings] = useState({
    lat: 15.775002,
    lng: 78.057125,
    radius: 500
  });
  const [profileData, setProfileData] = useState({
    name: '',
    role: ''
  });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: '',
    employeeId: '',
    department: '',
    role: 'student'
  });
  const [users, setUsers] = useState<Array<{id: number, name: string, email: string, role: string, status: string}>>([]);
  const [loadingData, setLoadingData] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  // Fetch user profile data and other data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const profile = await authAPI.getProfile();
        setProfileData({
          name: profile.name || '',
          role: profile.role || ''
        });

        // For now, we'll use mock data for users since there's no specific API endpoint
        // In a real implementation, you would fetch this from an API
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'Student', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@university.edu', role: 'Student', status: 'Active' },
          { id: 3, name: 'Prof. Williams', email: 'williams@university.edu', role: 'Faculty', status: 'Active' },
          { id: 4, name: 'Dr. Johnson', email: 'johnson@university.edu', role: 'Faculty', status: 'Active' },
        ];
        setUsers(mockUsers);
      } catch (error: unknown) {
        console.error('Failed to fetch data:', error);
        // Even in case of error, we can still show mock data
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@university.edu', role: 'Student', status: 'Active' },
          { id: 2, name: 'Jane Smith', email: 'jane@university.edu', role: 'Student', status: 'Active' },
          { id: 3, name: 'Prof. Williams', email: 'williams@university.edu', role: 'Faculty', status: 'Active' },
          { id: 4, name: 'Dr. Johnson', email: 'johnson@university.edu', role: 'Faculty', status: 'Active' },
        ];
        setUsers(mockUsers);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      redirectToLogin();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      redirectToLogin();
    }
  };

  const totalUsers = users.length;
  const activeSessions = 23; // This would come from an API in a real implementation
  const avgAttendance = 87.3; // This would come from an API in a real implementation
  const faceRegistered = 892; // This would come from an API in a real implementation

  const stats = [
    { label: 'Total Users', value: `${totalUsers}`, change: '+12%', icon: Users },
    { label: 'Active Sessions', value: `${activeSessions}`, change: '+5%', icon: Shield },
    { label: 'Avg Attendance', value: `${avgAttendance}%`, change: '+3.2%', icon: TrendingUp },
    { label: 'Face Registered', value: `${faceRegistered}`, change: '+8%', icon: Camera },
  ];

  // Handle geofence settings change
  const handleGeofenceChange = (field: string, value: string) => {
    setGeofenceSettings({
      ...geofenceSettings,
      [field]: field === 'radius' ? parseInt(value) : value
    });
  };

  // Save geofence settings
  const saveGeofenceSettings = () => {
    console.log('Geofence settings saved:', geofenceSettings);
    alert('Geofence settings saved successfully!');
  };

  // Capture face image for registration
  const captureFaceImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // In a real app, this would send the image to backend for storage
        console.log('Captured face image for registration:', imageSrc);
        alert('Face data captured successfully!');
      }
    }
  };

  return (
    <main className="min-h-screen bg-primary-bg">
      <header className="sticky top-0 z-50 bg-primary-bg/80 backdrop-blur-sm border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-accent-bronze" />
            <div>
              <h1 className="text-subheader-md text-text-primary font-medium">{profileData.name || 'Admin User'}</h1>
              <p className="text-body-md text-text-secondary">{profileData.role ? profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1) + ' Role' : 'Administrator'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="logout-button text-text-secondary hover:text-bronze transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-label uppercase tracking-wider">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="premium-card p-6 rounded-xl shadow-soft"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent-bronze/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-accent-bronze" />
                </div>
                <span className="text-label text-green-600">{stat.change}</span>
              </div>
              <p className="text-body-md text-text-secondary mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-header-md text-text-primary font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="premium-card rounded-xl shadow-soft overflow-hidden">
          <div className="border-b border-primary px-6">
            <div className="flex gap-8">
              {[
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'faces', label: 'Face Data', icon: Camera },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 transition-all font-medium ${
                    activeTab === tab.id
                      ? 'border-accent-bronze text-accent-bronze'
                      : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-label uppercase tracking-wider">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'analytics' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-subheader-lg text-text-primary mb-6 font-serif">System Analytics</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="chart-container h-80 flex items-center justify-center rounded-xl">
                    <p className="text-text-secondary text-body-md">Attendance Trend Chart</p>
                  </div>
                  <div className="chart-container h-80 flex items-center justify-center rounded-xl">
                    <p className="text-text-secondary text-body-md">Department Performance</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-subheader-lg text-text-primary font-serif">User Management</h2>
                  <button 
                    onClick={() => {
                      // Reset form data
                      setRegistrationData({
                        name: '',
                        email: '',
                        password: '',
                        studentId: '',
                        employeeId: '',
                        department: '',
                        role: 'student'
                      });
                      setShowRegistrationModal(true);
                    }}
                    className="premium-button primary px-6 py-3 rounded-full text-label uppercase tracking-wider flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add User
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="premium-input w-full pl-12 pr-4 py-3 rounded-full text-body-md"
                    />
                  </div>
                </div>

                {loadingData ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="luxury-loader"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-body-md text-text-secondary">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user, i: number) => (
                      <div key={i} className="premium-card p-4 rounded-xl flex items-center justify-between hover:shadow-soft transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-accent-bronze flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-body-lg text-text-primary font-medium">{user.name}</p>
                            <p className="text-body-md text-text-secondary">{user.email} • {user.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-label font-medium">Active</span>
                          <button className="text-text-secondary hover:text-bronze transition-colors">
                            <Settings className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'faces' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-subheader-lg text-text-primary mb-6 font-serif">Face Data Management</h2>
                  <button 
                    onClick={() => setShowFaceRegistration(true)}
                    className="premium-button primary px-6 py-3 rounded-full text-label uppercase tracking-wider flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Register New Face
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="premium-card p-6 rounded-xl text-center hover:shadow-soft transition-all">
                      <div className="w-24 h-24 rounded-full bg-accent-bronze/10 mx-auto mb-4 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-accent-bronze" />
                      </div>
                      <p className="text-body-lg text-text-primary font-medium mb-1">Student {item}</p>
                      <p className="text-body-md text-text-secondary mb-4">STU202400{item}</p>
                      <span className="px-4 py-2 rounded-full bg-green-100 text-green-800 text-label font-medium">Registered</span>
                    </div>
                  ))}
                </div>
                
                {/* Face Registration Modal */}
                {showFaceRegistration && (
                  <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={(e) => {
                      // Close modal when clicking on backdrop
                      if (e.target === e.currentTarget) {
                        setShowFaceRegistration(false);
                      }
                    }}
                  >
                    <div className="premium-card p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-subheader-md text-text-primary font-medium">Register Student Face</h3>
                        <button 
                          onClick={() => setShowFaceRegistration(false)}
                          className="text-text-secondary hover:text-bronze"
                          aria-label="Close"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-label text-text-secondary mb-2">Student ID</label>
                          <input
                            type="text"
                            placeholder="Enter student ID"
                            className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-label text-text-secondary mb-2">Student Name</label>
                          <input
                            type="text"
                            placeholder="Enter student name"
                            className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                          />
                        </div>
                        
                        <div className="text-center">
                          <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center mb-4 relative overflow-hidden">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 border-4 border-accent-bronze rounded-lg pointer-events-none"></div>
                          </div>
                          <button 
                            onClick={captureFaceImage}
                            className="premium-button primary px-6 py-3 rounded-full text-label flex items-center gap-2 mx-auto"
                          >
                            <Camera className="w-5 h-5" />
                            Capture Face
                          </button>
                        </div>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => setShowFaceRegistration(false)}
                            className="premium-button w-full py-3 rounded-full text-label border border-primary"
                          >
                            Cancel
                          </button>
                          <button className="premium-button primary w-full py-3 rounded-full text-label">
                            Save Face Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-subheader-lg text-text-primary mb-6 font-serif">System Settings</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="premium-card p-6 rounded-xl shadow-soft">
                    <div className="flex items-center gap-3 mb-6">
                      <MapPin className="w-6 h-6 text-accent-bronze" />
                      <h3 className="text-subheader-md text-text-primary font-medium">Geofencing</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-label text-text-secondary mb-2 uppercase tracking-wider">Campus Latitude</label>
                        <input
                          type="text"
                          value={geofenceSettings.lat}
                          onChange={(e) => handleGeofenceChange('lat', e.target.value)}
                          className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                        />
                      </div>
                      <div>
                        <label className="block text-label text-text-secondary mb-2 uppercase tracking-wider">Campus Longitude</label>
                        <input
                          type="text"
                          value={geofenceSettings.lng}
                          onChange={(e) => handleGeofenceChange('lng', e.target.value)}
                          className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                        />
                      </div>
                      <div>
                        <label className="block text-label text-text-secondary mb-2 uppercase tracking-wider">Radius (meters)</label>
                        <input
                          type="number"
                          value={geofenceSettings.radius}
                          onChange={(e) => handleGeofenceChange('radius', e.target.value)}
                          className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                        />
                      </div>
                      <button
                        onClick={saveGeofenceSettings}
                        className="premium-button primary px-6 py-3 rounded-full text-label uppercase tracking-wider"
                      >
                        Save Geofence Settings
                      </button>
                    </div>
                  </div>

                  <div className="premium-card p-6 rounded-xl shadow-soft">
                    <div className="flex items-center gap-3 mb-6">
                      <Shield className="w-6 h-6 text-accent-bronze" />
                      <h3 className="text-subheader-md text-text-primary font-medium">Security</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Face Verification Required', enabled: true },
                        { label: 'Geofencing Enabled', enabled: true },
                        { label: 'Email Notifications', enabled: false },
                      ].map((setting, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-body-md text-text-primary uppercase tracking-wider">{setting.label}</span>
                          <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                            setting.enabled ? 'bg-accent-bronze' : 'bg-primary-card border border-primary'
                          }`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              setting.enabled ? 'right-1' : 'left-1'
                            }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Close modal when clicking on backdrop
            if (e.target === e.currentTarget) {
              setShowRegistrationModal(false);
            }
          }}
        >
          <div className="premium-card p-6 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-subheader-md text-text-primary font-medium">Register New User</h3>
              <button 
                onClick={() => setShowRegistrationModal(false)}
                className="text-text-secondary hover:text-bronze"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-label text-text-secondary mb-2">User Role</label>
                <select
                  value={registrationData.role}
                  onChange={(e) => setRegistrationData({...registrationData, role: e.target.value})}
                  className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">Head of Department (Admin)</option>
                  <option value="dean">Dean (Admin)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-label text-text-secondary mb-2">Full Name</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  placeholder="Enter full name"
                  className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                />
              </div>
              
              <div>
                <label className="block text-label text-text-secondary mb-2">Email</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  placeholder="Enter email address"
                  className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                />
              </div>
              
              <div>
                <label className="block text-label text-text-secondary mb-2">Password</label>
                <input
                  type="password"
                  value={registrationData.password}
                  onChange={(e) => setRegistrationData({...registrationData, password: e.target.value})}
                  placeholder="Enter password"
                  className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                />
              </div>
              
              {registrationData.role === 'student' && (
                <div>
                  <label className="block text-label text-text-secondary mb-2">Student ID</label>
                  <input
                    type="text"
                    value={registrationData.studentId}
                    onChange={(e) => setRegistrationData({...registrationData, studentId: e.target.value})}
                    placeholder="Enter student ID"
                    className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                  />
                </div>
              )}
              
              {(registrationData.role === 'faculty' || registrationData.role === 'hod' || registrationData.role === 'dean') && (
                <>
                  <div>
                    <label className="block text-label text-text-secondary mb-2">
                      {registrationData.role === 'faculty' ? 'Employee ID' : 
                       registrationData.role === 'hod' ? 'HOD ID' : 'Dean ID'}
                    </label>
                    <input
                      type="text"
                      value={registrationData.employeeId}
                      onChange={(e) => setRegistrationData({...registrationData, employeeId: e.target.value})}
                      placeholder={`Enter ${registrationData.role === 'faculty' ? 'employee' : 
                                   registrationData.role === 'hod' ? 'HOD' : 'Dean'} ID`}
                      className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-label text-text-secondary mb-2">Department</label>
                    <input
                      type="text"
                      value={registrationData.department}
                      onChange={(e) => setRegistrationData({...registrationData, department: e.target.value})}
                      placeholder="Enter department"
                      className="premium-input w-full px-4 py-3 rounded-lg text-body-md"
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowRegistrationModal(false)}
                  className="premium-button w-full py-3 rounded-full text-label border border-primary"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      // Validate required fields
                      if (!registrationData.name || !registrationData.email || !registrationData.password) {
                        alert('Please fill in all required fields');
                        return;
                      }
                      
                      if (registrationData.role === 'student' && !registrationData.studentId) {
                        alert('Please enter Student ID');
                        return;
                      }
                      
                      if ((registrationData.role === 'faculty' || registrationData.role === 'hod' || registrationData.role === 'dean') && 
                          (!registrationData.employeeId || !registrationData.department)) {
                        alert('Please enter both Employee ID and Department');
                        return;
                      }
                      
                      if (registrationData.role === 'student') {
                        await authAPI.registerStudent({
                          name: registrationData.name,
                          email: registrationData.email,
                          password: registrationData.password,
                          studentId: registrationData.studentId
                        });
                      } else {
                        await authAPI.registerFaculty({
                          name: registrationData.name,
                          email: registrationData.email,
                          password: registrationData.password,
                          employeeId: registrationData.employeeId,
                          department: registrationData.department
                        });
                      }
                      
                      // Close modal and show success message
                      setShowRegistrationModal(false);
                      alert('User registered successfully!');
                      
                      // In a real app, you would refresh the user list here
                    } catch (error: unknown) {
                      alert(error instanceof Error ? error.message : 'Registration failed');
                    }
                  }}
                  className="premium-button primary w-full py-3 rounded-full text-label"
                >
                  Register User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
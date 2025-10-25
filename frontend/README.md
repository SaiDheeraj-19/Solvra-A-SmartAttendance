# Smart Attendance Management System - Frontend

A comprehensive React-based frontend for the Smart Attendance Management System with geo-fencing, QR code scanning, and facial recognition capabilities.

## 🚀 Features

### Core Functionality
- **Geo-fencing Validation**: Attendance marking restricted to campus boundaries
- **QR Code Scanning**: Unique QR codes for each class session
- **Face ID Verification**: Facial recognition for identity confirmation
- **Real-time Updates**: Live session management with Socket.IO

### User Roles & Portals

#### Student Portal
- Registration with personal information and student ID
- QR code scanning with camera integration
- Face verification using webcam
- Attendance history with filtering options
- Real-time location validation

#### Faculty Portal
- QR code generation for class sessions
- Session management with expiration controls
- Attendance reports with analytics
- Student attendance tracking
- Export functionality for reports

#### Admin Portal
- User management (students, faculty, admin)
- Face data management for all students
- System settings configuration
- Comprehensive analytics dashboard
- Geo-fence boundary configuration

## 🛠 Technology Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **Recharts** - Data visualization and charts
- **React Webcam** - Camera integration
- **Lucide React** - Modern icon library
- **React Hot Toast** - Notification system
- **Date-fns** - Date manipulation utilities

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/                 # Authentication components
│   │   ├── Login.js
│   │   └── Register.js
│   ├── student/              # Student portal components
│   │   ├── StudentDashboard.js
│   │   ├── QRScanner.js
│   │   └── AttendanceHistory.js
│   ├── faculty/              # Faculty portal components
│   │   ├── FacultyDashboard.js
│   │   ├── QRGenerator.js
│   │   └── AttendanceReports.js
│   ├── admin/                # Admin portal components
│   │   ├── AdminDashboard.js
│   │   ├── UserManagement.js
│   │   ├── FaceManagement.js
│   │   ├── SystemSettings.js
│   │   └── Analytics.js
│   └── common/               # Shared components
│       └── Layout.js
├── contexts/                 # React contexts
│   └── AuthContext.js
├── services/                 # API services
│   ├── authService.js
│   └── attendanceService.js
├── utils/                    # Utility functions
│   └── geolocation.js
├── App.js                    # Main app component
└── index.js                  # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5005

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5005/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Integration
The frontend communicates with the backend API through axios interceptors that handle:
- Authentication token management
- Request/response logging
- Error handling and token refresh

### Geolocation Settings
Configure campus boundaries in the admin settings:
- Latitude/Longitude coordinates
- Radius in meters
- Enable/disable geo-fencing

### Camera Permissions
The application requires camera permissions for:
- QR code scanning
- Face verification
- Face data registration

## 📱 User Workflows

### Student Attendance Flow
1. **Location Check**: Verify student is within campus boundaries
2. **QR Scan**: Scan or manually enter QR code from instructor
3. **Face Verification**: Capture and verify facial image
4. **Confirmation**: Receive attendance confirmation

### Faculty Session Flow
1. **Create Session**: Select subject, class, and duration
2. **Generate QR**: System creates unique QR code
3. **Display Code**: Show QR code to students
4. **Monitor**: Track real-time attendance submissions
5. **End Session**: Close attendance window

### Admin Management Flow
1. **User Management**: Add/edit/delete users
2. **Face Registration**: Upload student face data
3. **System Configuration**: Set geo-fence and security settings
4. **Analytics Review**: Monitor system-wide statistics

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for each user type
- **Geo-fencing**: Location-based attendance validation
- **Face Verification**: Biometric identity confirmation
- **Session Management**: Automatic logout and token refresh

## 📊 Analytics & Reporting

### Student Analytics
- Attendance percentage
- Class-wise breakdown
- Historical trends
- Late arrival tracking

### Faculty Reports
- Subject-wise attendance
- Student performance metrics
- Export capabilities (CSV)
- Visual charts and graphs

### Admin Dashboard
- System-wide statistics
- Department comparisons
- User activity monitoring
- Performance metrics

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive user interface
- **Real-time Updates**: Live data synchronization
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design

## 🔧 Customization

### Styling
The application uses utility-first CSS classes. Modify `src/index.css` for global styles.

### Components
All components are modular and can be easily customized or extended.

### API Endpoints
Update service files in `src/services/` to modify API integration.

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Compressed images and icons
- **Caching**: Efficient API response caching
- **Bundle Optimization**: Minimized production builds

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify camera hardware

2. **Location services disabled**
   - Enable location services in browser
   - Check device GPS settings
   - Verify HTTPS for geolocation API

3. **API connection issues**
   - Verify backend server is running
   - Check API URL configuration
   - Review network connectivity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

Built with ❤️ for modern educational institutions
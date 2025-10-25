# SmartPresence - Precision Attendance & Marks Tracking System

SmartPresence is a modern, luxury-designed automated attendance and marks tracking system with advanced features including Geo-fencing, QR-based verification, and Face ID authentication.

## 🎨 Design Philosophy

The interface combines the clean, editorial, and luxurious aesthetic of Modern Huntsman with the futuristic, minimal, tech-driven polish of Vision.Avatr.com. The final result feels expensive, slow-crafted, and cinematic with:

- Calm spacing and matte tones
- Subtle animations and editorial typography
- Custom luxury cursor with glow effects
- Premium card and button components
- Sophisticated color palette

## 🎨 Visual & Style Direction

### Mood
Modern luxury, minimal, heritage-tech blend

### Color Palette
- **Background**: #f9f8f7 (warm off-white)
- **Text**: #1b1b1b (deep ink black)
- **Accent**: #bfa47a (muted gold-bronze)
- **Hover/Shadow**: Soft diffused gray, no harsh contrast

### Typography
- **Headlines**: "Playfair Display" (serif, classic)
- **Body/UI**: "Inter" (sans-serif, modern clarity)
- **Uppercase menu text** with wide letter spacing and fine line-weights

### Layout
- Full-width, editorial spacing, fixed header
- Subtle parallax and fade animations (Framer Motion)
- Large whitespace and asymmetrical balance

### Cursor Animation
- Soft halo + small accent dot
- Smooth lag effect
- Glow on hover
- Disappears over form fields or buttons

### Component Effects
- **Cards**: Matte surfaces, thin borders (1px rgba(0,0,0,0.08))
- **Buttons**: Minimal frame + subtle hover motion
- **No gradients**, no heavy glassmorphism — pure matte luxury

## 🧭 Pages & Flow

### 1. Landing / Login Page
- Hero section with muted background image
- Headline: "Reimagining Attendance with Precision."
- Subhead: "Geo-fence, Face ID, and AI-powered insights."
- Login buttons for Student, Faculty, Admin
- Minimal footer with contact information
- Micro-animation on page load (fade-in text + parallax hero)

### 2. Loading Screen
- Full-screen minimalist loader
- Centered glowing logo animation or circular bronze outline pulse
- Smooth fade transition to next page
- Background color: off-white #f9f8f7

### 3. Student Dashboard
- Clean, balanced grid layout
- **Cards**:
  - Attendance overview (daily/weekly %)
  - QR scan widget
  - Face ID verification panel
  - Marks Summary (bar graph or subject list)
- Smooth hover scaling (1.03x)
- Animated transitions for data load
- Logout button (top-right, subtle underline animation)

### 4. Faculty Dashboard
- Class list view with options to:
  - Generate QR codes per class/session
  - View attendance analytics (chart components)
  - Approve or correct attendance logs
- Sidebar navigation (minimal vertical layout, serif headers)
- Table UI: neutral borders, soft row highlight on hover
- Micro animations on table sort/filter

### 5. Admin Dashboard
- Control panel layout (3-column responsive grid)
- **Sections**:
  - User Management (register/approve students & faculty)
  - Geo-fence Settings (interactive map input fields)
  - Face Data Registration (upload & preview section)
  - Global Analytics (attendance %, trends, tardiness)
- Accent color used only for interactive or important CTAs
- No unnecessary decoration — pure function meets form

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: TailwindCSS with custom configuration
- **Animations**: Framer Motion
- **Components**: React with TypeScript
- **Camera**: react-webcam for face recognition
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── faculty/           # Faculty dashboard
│   ├── login/             # Authentication pages
│   ├── student/           # Student dashboard
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── FaceCamera.tsx     # Face recognition camera
│   ├── LoadingScreen.tsx  # Loading animation
│   ├── LuxuryCursor.tsx   # Custom cursor
│   └── Notification.tsx   # Notification system
├── services/              # API services
│   ├── api.ts            # Authentication API
│   └── faceService.ts    # Face recognition API
└── types/                # TypeScript types
```

## 🎯 Key Features

### Geo-fencing
- Location-based attendance validation
- Campus boundary detection with 500m radius
- Real-time location verification

### QR-based Verification
- Dynamic QR code generation
- Location-aware QR codes
- Session-based attendance tracking

### Face ID Authentication
- Biometric face verification
- Camera integration with face detection
- Secure face data storage

### Attendance Tracking
- Real-time attendance monitoring
- Comprehensive analytics dashboard
- Detailed attendance history

### Marks Tracking
- Subject-wise performance tracking
- Grade analysis and reporting
- Academic progress visualization

## 🎨 Design Components

### Luxury Custom Cursor
- Soft halo effect with bronze accent
- Smooth lag animation for natural movement
- Glow effect on interactive elements
- Auto-hide on form fields

### Premium Cards
- Matte surface with subtle border
- Soft shadow on hover
- Smooth scaling animation
- Backdrop blur effect

### Premium Buttons
- Minimal frame design
- Subtle hover animations
- Gradient shine effect on primary buttons
- Bronze color scheme for CTAs

### Loading Animations
- Elegant spinner with bronze accents
- Pulse animations for async operations
- Smooth transitions between states

## 📱 Responsive Design

The application is fully responsive and adapts to all screen sizes:
- Mobile-first approach
- Flexible grid layouts
- Adaptive typography
- Touch-friendly interactions

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit `http://localhost:3000`

## 🛠️ Development Guidelines

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Component-based architecture

### Performance
- Optimized animations with Framer Motion
- Lazy loading for heavy components
- Efficient state management
- Minimal bundle size

### Accessibility
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility

## 🎯 Future Enhancements

- Dark mode support
- Advanced analytics dashboard
- Mobile app integration
- AI-powered attendance insights
- Multi-language support
- Integration with learning management systems

## 📄 License

This project is proprietary and confidential. All rights reserved.
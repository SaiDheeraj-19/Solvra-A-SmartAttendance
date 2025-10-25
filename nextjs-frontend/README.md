# SmartPresence - Automated Attendance & Marks Tracking System

A Next.js 15 + TailwindCSS frontend for an Automated Attendance & Marks Tracking System with Geo-fencing, QR-based verification, and Face ID authentication.

## Features

- **Modern Luxury Design**: Clean, editorial, and luxurious aesthetic inspired by Modern Huntsman and Vision.Avatr.com
- **Three User Portals**: Student, Faculty, and Admin dashboards
- **Custom Animations**: Subtle animations and transitions using Framer Motion
- **Luxury Cursor**: Custom cursor with halo effect and smooth lag
- **Responsive Design**: Fully responsive interface for all device sizes

## Design Elements

### Color Palette
- Background: #f9f8f7 (warm off-white)
- Text: #1b1b1b (deep ink black)
- Accent: #bfa47a (muted gold-bronze)

### Typography
- Headlines: "Playfair Display" (serif, classic)
- Body/UI: "Inter" (sans-serif, modern clarity)

### Layout
- Full-width, editorial spacing
- Fixed header
- Large whitespace and asymmetrical balance

## Portals

### Student Portal
- Attendance overview cards
- QR scan widget
- Face ID verification panel
- Marks summary

### Faculty Portal
- Class list view
- QR code generation per class/session
- Attendance analytics
- Attendance log approval

### Admin Portal
- User management
- Geo-fence settings
- Face data registration
- Global analytics

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ✨ Features

### Design
- 🎨 **Luxury Dark Theme** - Sophisticated dark UI with glass morphism effects
- ✨ **Smooth Animations** - Framer Motion powered transitions
- 🌟 **Futuristic Aesthetics** - Gradient accents, glow effects, and modern typography
- 📱 **Fully Responsive** - Seamless experience across all devices
- 🎭 **Interactive Elements** - Hover effects, micro-interactions, and smooth transitions

### Functionality
- 🔐 **Authentication** - Secure login/register with role-based access
- 📊 **Student Portal** - QR scanning, attendance history, profile management
- 👨‍🏫 **Faculty Portal** - QR generation, session management, reports
- ⚙️ **Admin Dashboard** - User management, analytics, system settings
- 📍 **Geo-fencing** - Location-based attendance validation
- 📸 **Face Recognition** - Biometric verification support
- 📈 **Real-time Analytics** - Live attendance tracking and insights

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
nextjs-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── student/           # Student dashboard
│   │   ├── faculty/           # Faculty dashboard
│   │   ├── admin/             # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and helpers
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── next.config.ts             # Next.js configuration
└── package.json
```

## 🎨 Design System

### Colors
- **Background**: `#0a0a0a` (luxury-darker)
- **Surface**: `#1a1a1a` (luxury-light)
- **Primary**: Blue gradient (`#667eea` → `#764ba2`)
- **Accent**: Various gradient combinations

### Typography
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **Monospace**: For codes and technical data

### Components
- **Glass Effect**: Frosted glass morphism with backdrop blur
- **Cards**: Elevated surfaces with hover animations
- **Buttons**: Gradient backgrounds with shimmer effects
- **Inputs**: Dark themed with focus states

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## 📱 Pages

### Landing Page (`/`)
- Hero section with animated gradients
- Feature showcase
- Call-to-action sections

### Login (`/login`)
- Email/password authentication
- Social login options
- Forgot password link

### Student Dashboard (`/student`)
- Attendance statistics
- QR code scanner
- Attendance history
- Profile management

### Faculty Dashboard (`/faculty`)
- Session statistics
- QR code generator
- Attendance reports
- Student list

### Admin Dashboard (`/admin`)
- System analytics
- User management
- Face data management
- System settings

## 🎯 Key Features

### Attendance Flow
1. **Location Verification** - Check if student is on campus
2. **QR Scanning** - Scan instructor's QR code
3. **Face Verification** - Biometric confirmation
4. **Confirmation** - Attendance marked successfully

### QR Generation
1. Select subject and class
2. Set session duration
3. Generate unique QR code
4. Display to students
5. Monitor real-time attendance

### Analytics
- Real-time attendance tracking
- Department-wise performance
- Trend analysis
- Export capabilities

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Geo-fencing validation
- Face recognition support
- Secure session management

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.ts` to customize colors:
```typescript
colors: {
  luxury: {
    dark: '#0a0a0a',
    light: '#1a1a1a',
    // Add your colors
  }
}
```

### Animations
Modify `globals.css` for custom animations:
```css
@keyframes yourAnimation {
  /* Your keyframes */
}
```

## 📦 Dependencies

### Core
- `next`: ^15.0.3
- `react`: ^19.0.0
- `typescript`: ^5.6.3

### UI & Styling
- `tailwindcss`: ^3.4.13
- `framer-motion`: ^11.5.4
- `lucide-react`: ^0.445.0

### Utilities
- `axios`: ^1.7.7
- `date-fns`: ^3.6.0
- `clsx`: ^2.1.1

## 🚀 Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Docker
```bash
docker build -t attendance-system .
docker run -p 3000:3000 attendance-system
```

## 📝 Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5005/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5005
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use for your projects

## 🙏 Acknowledgments

- Design inspiration: vision.avatr.com
- Icons: Lucide React
- Animations: Framer Motion

---

Built with ❤️ using Next.js 15 and TailwindCSS

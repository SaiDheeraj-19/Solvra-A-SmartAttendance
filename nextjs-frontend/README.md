# Solvra Attendance System

A smart attendance system with advanced features including face recognition, QR code scanning, and geofencing.

## Features

- **Face Recognition**: For user registration and login
- **QR Code Attendance**: Scan-based check-in with generation and validation
- **Geofencing**: Location-based attendance validation
- **Two-Step Verification**: Enhanced security flow
- **Multi-role Dashboards**: Student, Faculty, and Admin interfaces

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

### Deploy using CLI

1. Navigate to the project directory:
   ```bash
   cd /Users/saidheeraj/Documents/Solvra/nextjs-frontend
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

### Deploy using the deployment script

1. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

### Environment Variables

After deployment, make sure to set the following environment variables in your Vercel project settings:

- `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., https://your-backend-url.com/api)

### Important Notes

1. The backend server needs to be deployed separately (Node.js server on port 5005)
2. Make sure to update the API URL in Vercel environment settings after deploying the backend
3. The application uses geofencing with coordinates: Latitude 15.775002, Longitude 78.057125

## Development

To run the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3010

## Built With

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Socket.IO

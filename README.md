# Solvra - Smart Attendance System

Solvra is a comprehensive smart attendance solution designed to streamline monitoring for educational institutions. It leverages modern web technologies, geofencing, and biometric authentication to verify student presence reliably and efficiently.

## Features

- **Role-Based Access**:
    - **Admin**: Manage users (students/faculty), configure geofences, view system-wide analytics.
    - **Faculty**: Monitor class attendance, view reports.
    - **Student**: Mark attendance using geofencing and face verification, view attendance history.
- **Geofencing**: Ensures students are physically present within the designated area (classroom/campus) to mark attendance.
- **Biometric Verification**: (In Progress) Face recognition/verification integration for secure attendance marking.
- **Real-time Monitoring**: Live updates on attendance status.

## Tech Stack

### Backend
- **Node.js & Express**: Robust REST API.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: OMG for data modeling.
- **JWT**: Secure authentication.

### Frontend
- **Next.js**: React framework for server-side rendering and static generation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: For smooth animations.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SaiDheeraj-19/Solvra-A-SmartAttendance.git
    cd Solvra-A-SmartAttendance
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create a .env file based on your configuration (PORT, MONGO_URI, JWT_SECRET, etc.)
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd nextjs-frontend
    npm install
    npm run dev
    ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

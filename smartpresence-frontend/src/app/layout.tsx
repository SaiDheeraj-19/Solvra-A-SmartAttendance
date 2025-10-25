import React from 'react'
import '../globals.css'

export const metadata = {
  title: 'SmartPresence - Precision Attendance & Marks Tracking',
  description: 'Automated attendance system with Geo-fencing, QR-based verification, and Face ID authentication'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-primary-bg text-text-primary">
        {children}
      </body>
    </html>
  )
}

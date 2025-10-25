#!/bin/bash

# Solvra Attendance System Deployment Script for Vercel

echo "🚀 Starting Solvra Attendance System Deployment to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "⚠️  Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Navigate to the frontend directory
cd /Users/saidheeraj/Documents/Solvra/nextjs-frontend

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1
then
    echo "⚠️  Not in a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
fi

# Login to Vercel (this will prompt for login)
echo "🔐 Please login to your Vercel account:"
vercel login

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo "📝 Note: Remember to update the NEXT_PUBLIC_API_URL in your Vercel project settings to point to your backend URL"

#!/usr/bin/env node

/**
 * Day 17: API Testing Helper Script
 * This script helps you run and test the Day 17 API implementation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Day 17: API Testing & Quality Assurance');
console.log('==========================================\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.log('❌ Error: package.json not found. Please run this script from the Day-17 directory.');
    process.exit(1);
}

console.log('📦 Installing dependencies...\n');
try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully!\n');
} catch (error) {
    console.log('❌ Error installing dependencies:', error.message);
    process.exit(1);
}

console.log('🚀 Starting the API server...\n');
try {
    console.log('📱 Server will be available at: http://localhost:5000');
    console.log('🧪 Testing interface at: http://localhost:5000');
    console.log('💚 Health check at: http://localhost:5000/api/health\n');
    console.log('Press Ctrl+C to stop the server\n');

    execSync('npm start', { stdio: 'inherit' });
} catch (error) {
    if (error.signal === 'SIGINT') {
        console.log('\n👋 Server stopped by user');
    } else {
        console.log('❌ Error starting server:', error.message);
    }
}

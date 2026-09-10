/**
 * Production-Ready Express Server for Render Deployment
 * Developer Portfolio & Quick Tools Dashboard
 */

const express = require('express');
const path = require('path');

const app = express();

// Use PORT from environment variables (provided by Render) or fallback to 3000
const PORT = process.env.PORT || 3000;

// Body parsing middleware for JSON and form-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Render service uptime monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Contact form API route
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields. Please provide name, email, and message.'
    });
  }

  // Log incoming message to server console (visible in Render logs)
  console.log(`[New Inquiry Received]`);
  console.log(`- From: ${name} (${email})`);
  console.log(`- Subject: ${subject || 'General Inquiry'}`);
  console.log(`- Message: ${message}`);
  console.log(`- Time: ${new Date().toISOString()}`);

  return res.status(200).json({
    success: true,
    message: 'Your inquiry has been received. Thank you for reaching out!'
  });
});

// Single Page Application (SPA) fallback - all unhandled GET requests return index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bind to host 0.0.0.0 for containerized environments (Render, Cloud Run, Docker)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 Portfolio & Tools Server is running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`⚡ Port: ${PORT}`);
  console.log(`📁 Static Directory: ${path.join(__dirname, 'public')}`);
  console.log(`=========================================`);
});

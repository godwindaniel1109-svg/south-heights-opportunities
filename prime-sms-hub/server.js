const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle SPA routing - serve index.html for all routes that don't match files
app.get('*', (req, res) => {
    // Check if the request is for a specific HTML file
    const requestedFile = path.join(__dirname, req.path);
    
    // If it's a request for a file that exists, serve it
    if (req.path.endsWith('.html') || req.path.endsWith('.css') || 
        req.path.endsWith('.js') || req.path.endsWith('.jpg') || 
        req.path.endsWith('.png') || req.path.endsWith('.svg') ||
        req.path.endsWith('.ico')) {
        res.sendFile(requestedFile, (err) => {
            if (err) {
                res.status(404).send('File not found');
            }
        });
    } else {
        // For root or other paths, serve index.html
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Something went wrong!');
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`\n✨ Press Ctrl+C to stop the server\n`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.`);
        console.log(`💡 Try stopping other servers or use a different port.\n`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('\n👋 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});
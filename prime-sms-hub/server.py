#!/usr/bin/env python3
"""
Simple HTTP Server for Prime SMS Hub
Serves static files with proper MIME types and error handling
"""

import http.server
import socketserver
import os
import sys
from functools import partial

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with better error handling and logging"""
    
    def log_message(self, format, *args):
        """Override to provide cleaner logging"""
        sys.stdout.write("%s - [%s] %s\n" %
                        (self.address_string(),
                         self.log_date_time_string(),
                         format % args))
    
    def end_headers(self):
        """Add CORS headers for development"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def run_server():
    """Start the HTTP server with error handling"""
    handler = partial(CustomHTTPRequestHandler, directory=os.getcwd())
    
    try:
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print("\n🚀 Server is running!")
            print(f"📍 Local: http://localhost:{PORT}")
            print("\n✨ Press Ctrl+C to stop the server\n")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98 or e.errno == 10048:  # Address already in use
            print(f"\n❌ Port {PORT} is already in use.")
            print("💡 Try stopping other servers or use a different port.\n")
            sys.exit(1)
        else:
            raise
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down gracefully...")
        print("✅ Server closed\n")
        sys.exit(0)

if __name__ == "__main__":
    run_server()
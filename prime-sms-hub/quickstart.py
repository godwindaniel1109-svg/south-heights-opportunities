#!/usr/bin/env python3
"""
Quick start script for Prime SMS Hub
Run: python quickstart.py
"""

import os
import subprocess
import sys
import platform

def run_command(cmd, cwd=None):
    """Run a command and return success status"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("🚀 PRIME SMS HUB - Quick Start Setup")
    print("="*60 + "\n")
    
    # Check Python
    print("✅ Checking Python installation...")
    if not run_command(f"{sys.executable} --version"):
        print("❌ Python not found!")
        return False
    
    # Install requirements
    print("📦 Installing dependencies...")
    backend_path = os.path.join(os.path.dirname(__file__), 'backend')
    req_file = os.path.join(backend_path, 'requirements.txt')
    
    if not run_command(f"{sys.executable} -m pip install -r {req_file}"):
        print("❌ Failed to install dependencies")
        return False
    
    # Run migrations
    print("🗄️  Running database migrations...")
    if not run_command(f"{sys.executable} manage.py migrate", cwd=backend_path):
        print("❌ Failed to run migrations")
        return False
    
    # Create superuser if needed
    print("\n👤 Creating admin user...")
    print("   (Press Ctrl+C to skip)")
    try:
        run_command(f"{sys.executable} manage.py createsuperuser", cwd=backend_path)
    except:
        print("   Skipped")
    
    print("\n" + "="*60)
    print("✨ Setup Complete!")
    print("="*60)
    print("\n📝 Next steps:")
    print("   1. Run: python liveserver.py")
    print("   2. Open: http://localhost:8000")
    print("   3. Admin: http://localhost:8000/admin\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)

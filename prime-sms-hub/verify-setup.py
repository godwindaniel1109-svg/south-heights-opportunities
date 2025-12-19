#!/usr/bin/env python3
"""
Verification script for Prime SMS Hub Backend
Checks if everything is properly set up
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python():
    """Check Python version"""
    print("✓ Checking Python...")
    version = sys.version.split()[0]
    if sys.version_info >= (3, 8):
        print(f"  ✅ Python {version} (3.8+ required)")
        return True
    else:
        print(f"  ❌ Python {version} (3.8+ required)")
        return False

def check_directory_structure():
    """Check if all necessary directories exist"""
    print("\n✓ Checking directory structure...")
    required_dirs = [
        'backend',
        'backend/api',
        'backend/prime_sms',
        'js',
        'css',
    ]
    
    all_exist = True
    for dir_path in required_dirs:
        if os.path.isdir(dir_path):
            print(f"  ✅ {dir_path}/")
        else:
            print(f"  ❌ {dir_path}/ (missing)")
            all_exist = False
    
    return all_exist

def check_files():
    """Check if all necessary files exist"""
    print("\n✓ Checking files...")
    required_files = [
        'backend/manage.py',
        'backend/requirements.txt',
        'backend/.env',
        'backend/prime_sms/settings.py',
        'backend/prime_sms/urls.py',
        'backend/api/models.py',
        'backend/api/views.py',
        'backend/api/serializers.py',
        'backend/api/services.py',
        'js/backend-api.js',
        'js/live-reload.js',
        'liveserver.py',
        'start-dev.bat',
        'quickstart.py',
    ]
    
    all_exist = True
    for file_path in required_files:
        if os.path.isfile(file_path):
            size = os.path.getsize(file_path)
            print(f"  ✅ {file_path} ({size} bytes)")
        else:
            print(f"  ❌ {file_path} (missing)")
            all_exist = False
    
    return all_exist

def check_dependencies():
    """Check if critical dependencies can be imported"""
    print("\n✓ Checking dependencies...")
    
    dependencies = [
        ('django', 'Django'),
        ('rest_framework', 'Django REST Framework'),
        ('corsheaders', 'Django CORS Headers'),
        ('requests', 'Requests'),
    ]
    
    all_available = True
    for module, name in dependencies:
        try:
            __import__(module)
            print(f"  ✅ {name}")
        except ImportError:
            print(f"  ⚠️  {name} (not installed yet)")
            all_available = False
    
    if not all_available:
        print("\n  📝 Run: pip install -r backend/requirements.txt")
    
    return all_available

def check_env_config():
    """Check if .env file has required keys"""
    print("\n✓ Checking environment configuration...")
    
    env_file = 'backend/.env'
    if not os.path.isfile(env_file):
        print(f"  ❌ {env_file} not found")
        return False
    
    required_keys = [
        'FIREBASE_API_KEY',
        'PAYSTACK_SECRET_KEY',
        'FIVESIM_API_KEY',
        'SENDGRID_API_KEY',
        'SECRET_KEY',
        'DEBUG',
    ]
    
    with open(env_file, 'r') as f:
        env_content = f.read()
    
    all_present = True
    for key in required_keys:
        if key in env_content:
            print(f"  ✅ {key}")
        else:
            print(f"  ⚠️  {key} (missing)")
            all_present = False
    
    return all_present

def check_port():
    """Check if port 8000 is available"""
    print("\n✓ Checking port 8000...")
    
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', 8000))
    sock.close()
    
    if result == 0:
        print("  ⚠️  Port 8000 is already in use")
        return False
    else:
        print("  ✅ Port 8000 is available")
        return True

def check_git():
    """Check if git is available"""
    print("\n✓ Checking git...")
    
    try:
        subprocess.run(['git', '--version'], capture_output=True, check=True)
        print("  ✅ Git installed")
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("  ⚠️  Git not found (optional)")
        return False

def main():
    """Run all checks"""
    print("\n" + "="*60)
    print("🔍 Prime SMS Hub Backend - Verification")
    print("="*60 + "\n")
    
    checks = [
        ("Python Version", check_python),
        ("Directory Structure", check_directory_structure),
        ("Required Files", check_files),
        ("Environment Config", check_env_config),
        ("Port Availability", check_port),
        ("Dependencies", check_dependencies),
        ("Git", check_git),
    ]
    
    results = []
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append((check_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("📊 Summary")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {check_name}")
    
    print(f"\nPassed: {passed}/{total}")
    
    if passed == total:
        print("\n✨ Everything looks good! Ready to start:")
        print("   python liveserver.py")
        return 0
    elif passed >= total - 2:
        print("\n⚠️  Most checks passed. Install dependencies and try again:")
        print("   pip install -r backend/requirements.txt")
        return 1
    else:
        print("\n❌ Some checks failed. Please review the errors above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())

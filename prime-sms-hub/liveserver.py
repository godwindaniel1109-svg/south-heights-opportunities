#!/usr/bin/env python
"""
Live reload server for Prime SMS Hub
Combines Django backend with live reload for frontend files
"""

import os
import sys
import subprocess
import threading
from pathlib import Path
from livereload import Server
import argparse
import webbrowser
import time

# Add backend to path
BACKEND_PATH = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, BACKEND_PATH)

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')

try:
    import django
    django.setup()
except ModuleNotFoundError as e:
    missing = getattr(e, 'name', None) or str(e)
    print('\n❌ Missing Python module:', missing)
    print('This usually means project dependencies are not installed.')
    print('Please run the following commands to install dependencies and create a virtual environment:')
    print('\nWindows (PowerShell):')
    print('  python -m venv venv')
    print('  .\\venv\\Scripts\\Activate')
    print('  python -m pip install -r backend/requirements.txt')
    print('\nOr run the helper script:')
    print('  .\\start-dev.bat')
    print('\nThen retry: python liveserver.py\n')
    sys.exit(1)
except Exception as e:
    print('\n❌ Error during Django setup:')
    print(e)
    sys.exit(1)

# Ensure backend migrations are applied
os.chdir(BACKEND_PATH)
result = subprocess.run([sys.executable, 'manage.py', 'migrate'], capture_output=True)
if result.returncode != 0:
    print('\n❌ Error running migrations:')
    print(result.stderr.decode() if result.stderr else result.stdout.decode())
    sys.exit(1)

print("\n" + "="*60)
print("🚀 PRIME SMS HUB - Development Server")
print("="*60)
print("✅ Django Backend: http://localhost:8000/api")
print("✅ Admin Panel: http://localhost:8000/admin")
print("✅ Frontend: http://localhost:8000")
print("✅ Live Reload: Enabled")
print("="*60 + "\n")

# Create live reload server
server = Server()

# CLI args
parser = argparse.ArgumentParser(description='Start liveserver with optional Django')
parser.add_argument('--no-django', action='store_true', help='Do not start Django server; useful when Django already running')
parser.add_argument('--live-port', type=int, default=5500, help='Port for the livereload HTTP server')
parser.add_argument('--open', action='store_true', help='Open a browser to the LiveReload frontend URL after starting')
args = parser.parse_args()

# Determine project root for static files
PROJECT_ROOT = os.path.dirname(__file__)

# Watch patterns for live reload
watch_patterns = [
    '*.html',
    '*.css',
    'js/**/*.js',
    'css/**/*.css',
    'images/**/*',
]

for pattern in watch_patterns:
    server.watch(os.path.join(PROJECT_ROOT, pattern))

# Custom callback for backend changes
def on_backend_change(filepath):
    """Callback when backend files change"""
    print(f"📝 Backend file changed: {filepath}")
    # Django auto-reloader handles this, we just notify frontend to refresh

# Also watch backend files (will trigger reload on client side)
server.watch(os.path.join(BACKEND_PATH, '**', '*.py'), on_backend_change)

# No need to add backend change watchers for frontend patterns; backend change watcher is set above

# Start Django development server in background then start livereload
django_server_proc = None
try:
    if not args.no_django:
        print('⏳ Starting Django development server...')
        django_cmd = [sys.executable, 'manage.py', 'runserver', '8000', '--noreload']
        django_server_proc = subprocess.Popen(django_cmd, cwd=BACKEND_PATH)
        print(f'✅ Django started (pid={django_server_proc.pid}) on http://localhost:8000')
    else:
        print('ℹ️  Skipping Django startup (assuming already running on port 8000)')

    # Start livereload on a separate port (frontend clients will connect to the live websocket)
    live_port = args.live_port
    try:
        if args.open:
            # open browser after a short delay so server has a chance to start
            url = f"http://127.0.0.1:{live_port}/index.html"
            def open_browser_delayed(u, delay=0.6):
                time.sleep(delay)
                try:
                    webbrowser.open(u)
                except Exception:
                    pass
            threading.Thread(target=open_browser_delayed, args=(url,), daemon=True).start()
        server.serve(port=live_port, root=PROJECT_ROOT, liveport=35729, live_css=True)
    except OSError as e:
        print(f"⚠️  LiveReload port {live_port} was not available: {str(e)}")
        available = False
                for p in range(live_port+1, live_port+10):
            try:
                if args.open:
                    url = f"http://127.0.0.1:{p}/index.html"
                    threading.Thread(target=open_browser_delayed, args=(url,), daemon=True).start()
                server.serve(port=p, root=PROJECT_ROOT, liveport=35729, live_css=True)
                available = True
                break
            except OSError:
                continue
        if not available:
            print('❌ Unable to start LiveReload on any fallback ports (checked next 10 ports).')
            raise
except KeyboardInterrupt:
    print("\n✋ Server stopped")
    if django_server_proc:
        django_server_proc.terminate()
    sys.exit(0)
finally:
    if django_server_proc and django_server_proc.poll() is None:
        django_server_proc.terminate()

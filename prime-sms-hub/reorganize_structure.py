#!/usr/bin/env python3
"""
Reorganize Prime SMS Hub project structure for scalable deployment
Creates: frontend/, admin/, backend/ folders with proper organization
"""

import os
import shutil
from pathlib import Path

# Define project root
ROOT = Path('.')

# User-facing HTML files (go to frontend/)
FRONTEND_HTML = [
    'index.html', 'login.html', 'register.html', 'dashboard.html',
    'buy-number.html', 'buy-usa-number.html', 'buy-domain.html',
    'fund-wallet.html', 'my-numbers.html', 'order-history.html',
    'order-status.html', 'transaction-history.html', 'profile.html',
    'support.html', '404.html', 'box.html'
]

# Admin HTML files (go to admin/)
ADMIN_HTML = [
    'admin-login.html', 'admin-dashboard.html', 'admin-users.html',
    'admin-support.html'
]

# Files/folders to copy to frontend/
FRONTEND_ASSETS = ['css', 'js', 'images', 'media']

# Admin-specific assets
ADMIN_CSS = ['admin-sidebar.css', 'admin-notifications.css']

# Files that stay in root
ROOT_FILES = [
    'README.md', 'package.json', 'Procfile', '.gitignore',
    'pyproject.toml', 'server.js', 'server.py', 'liveserver.py',
    'quickstart.py', 'verify-setup.py', '*.md', '*.txt', '*.ps1',
    '*.bat', 'static', 'templates'
]

def create_dirs():
    """Create directory structure"""
    dirs = [
        'frontend/css', 'frontend/js', 'frontend/images', 'frontend/media',
        'admin/css', 'admin/js',
        'backend'  # backend already exists
    ]
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"[OK] Created {d}/")

def move_html_files():
    """Move HTML files to appropriate folders"""
    # Frontend HTML
    for html in FRONTEND_HTML:
        src = ROOT / html
        if src.exists():
            dst = ROOT / 'frontend' / html
            shutil.move(str(src), str(dst))
            print(f"[OK] Moved {html} -> frontend/")
    
    # Admin HTML
    for html in ADMIN_HTML:
        src = ROOT / html
        if src.exists():
            dst = ROOT / 'admin' / html
            shutil.move(str(src), str(dst))
            print(f"[OK] Moved {html} -> admin/")

def copy_frontend_assets():
    """Copy CSS/JS/images to frontend"""
    for asset in FRONTEND_ASSETS:
        src = ROOT / asset
        if src.exists() and src.is_dir():
            dst = ROOT / 'frontend' / asset
            if dst.exists():
                shutil.rmtree(str(dst))
            shutil.copytree(str(src), str(dst))
            print(f"[OK] Copied {asset}/ -> frontend/{asset}/")

def move_admin_css():
    """Move admin-specific CSS to admin/css"""
    css_dir = ROOT / 'css'
    admin_css_dir = ROOT / 'admin' / 'css'
    
    for css_file in ADMIN_CSS:
        src = css_dir / css_file
        if src.exists():
            dst = admin_css_dir / css_file
            shutil.move(str(src), str(dst))
            print(f"[OK] Moved css/{css_file} -> admin/css/")

def copy_admin_js():
    """Copy admin JS files"""
    admin_js_files = ['admin-dashboard.js', 'admin-profile.js', 'admin-permissions.js', 'admin.js']
    js_dir = ROOT / 'js'
    admin_js_dir = ROOT / 'admin' / 'js'
    
    for js_file in admin_js_files:
        src = js_dir / js_file
        if src.exists():
            dst = admin_js_dir / js_file
            shutil.copy2(str(src), str(dst))
            print(f"[OK] Copied js/{js_file} -> admin/js/")

def create_deployment_configs():
    """Create Netlify and Vercel config files"""
    
    # Netlify config for frontend
    netlify_toml = """# Netlify Configuration for Frontend
[build]
  publish = "frontend"
  command = "echo 'Frontend static site - no build needed'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
"""
    
    with open(ROOT / 'frontend' / 'netlify.toml', 'w', encoding='utf-8') as f:
        f.write(netlify_toml)
    print("[OK] Created frontend/netlify.toml")
    
    # Vercel config for backend
    vercel_json = """{
  "version": 2,
  "builds": [
    {
      "src": "backend/manage.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/api/$1"
    },
    {
      "src": "/admin",
      "dest": "backend/admin"
    },
    {
      "src": "/media/(.*)",
      "dest": "backend/media/$1"
    },
    {
      "src": "/static/(.*)",
      "dest": "backend/static/$1"
    }
  ]
}
"""
    
    with open(ROOT / 'backend' / 'vercel.json', 'w', encoding='utf-8') as f:
        f.write(vercel_json)
    print("[OK] Created backend/vercel.json")
    
    # Admin Netlify config (if deploying separately)
    admin_netlify_toml = """# Netlify Configuration for Admin Panel
[build]
  publish = "admin"
  command = "echo 'Admin static site - no build needed'"

[[redirects]]
  from = "/*"
  to = "/admin-login.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
"""
    
    with open(ROOT / 'admin' / 'netlify.toml', 'w', encoding='utf-8') as f:
        f.write(admin_netlify_toml)
    print("[OK] Created admin/netlify.toml")

def main():
    print("Starting project reorganization...\n")
    
    create_dirs()
    print()
    
    move_html_files()
    print()
    
    copy_frontend_assets()
    print()
    
    move_admin_css()
    print()
    
    copy_admin_js()
    print()
    
    create_deployment_configs()
    print()
    
    print("[DONE] Reorganization complete!")
    print("\n📁 New Structure:")
    print("  frontend/  - User-facing application")
    print("  admin/     - Admin panel")
    print("  backend/   - Django API (already exists)")
    print("\n⚠️  Next steps:")
    print("  1. Update path references in HTML files (css/, js/, images/)")
    print("  2. Update API endpoints if needed")
    print("  3. Test all pages")

if __name__ == '__main__':
    main()
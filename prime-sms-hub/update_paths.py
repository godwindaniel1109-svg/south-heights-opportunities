#!/usr/bin/env python3
"""
Update path references after reorganization
Changes relative paths to work with new folder structure
"""

import os
import re
from pathlib import Path

ROOT = Path('.')

def update_html_paths(file_path, is_admin=False):
    """Update path references in HTML files"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Update CSS paths - keep relative since files are in same folder structure
        # css/style.css stays css/style.css (no change needed)
        
        # Update JS paths - same as CSS
        # js/script.js stays js/script.js (no change needed)
        
        # Update image paths - same
        # images/logo.jpg stays images/logo.jpg
        
        # Update HTML links between pages
        if not is_admin:
            # Frontend pages - update links to other frontend pages
            # login.html -> login.html (same folder, no change)
            # But if linking from admin to frontend, would need ../frontend/
            pass
        else:
            # Admin pages - links to frontend need ../frontend/
            # Links to other admin pages stay the same
            content = re.sub(r'href=["\'](?!http|#|mailto:|tel:)([^"\']+\.html)["\']', 
                           lambda m: f'href="../frontend/{m.group(1)}"' if not m.group(1).startswith('admin') else m.group(0), 
                           content)
        
        # Update logout helper script path
        content = content.replace('js/logout-helper.js', '../frontend/js/logout-helper.js' if is_admin else 'js/logout-helper.js')
        
        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error updating {file_path}: {e}")
        return False

def main():
    print("Updating path references...\n")
    
    # Update frontend HTML files
    frontend_html = list(Path('frontend').glob('*.html'))
    for html in frontend_html:
        if update_html_paths(html, is_admin=False):
            print(f"[OK] Updated {html}")
    
    # Update admin HTML files  
    admin_html = list(Path('admin').glob('*.html'))
    for html in admin_html:
        if update_html_paths(html, is_admin=True):
            print(f"[OK] Updated {html}")
    
    print("\n[DONE] Path updates complete!")

if __name__ == '__main__':
    main()
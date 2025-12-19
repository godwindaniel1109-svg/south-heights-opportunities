import os
import re
import sys
import runpy
import requests

admin_url = os.environ.get('ADMIN_URL', 'http://127.0.0.1:8000')
username = os.environ.get('ADMIN_USERNAME')
password = os.environ.get('ADMIN_PASSWORD')

if not username or not password:
    print('Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables and run this script.')
    sys.exit(1)

session = requests.Session()
login_page = session.get(f'{admin_url}/admin/login/')
if login_page.status_code != 200:
    print('Could not reach admin login page. Status code:', login_page.status_code)
    sys.exit(1)

match = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', login_page.text)
csrf = match.group(1) if match else None
if not csrf:
    print('CSRF token not found on login page.')
    sys.exit(1)

resp = session.post(f'{admin_url}/admin/login/?next=/admin/', data={'username': username, 'password': password, 'csrfmiddlewaretoken': csrf}, headers={'Referer': f'{admin_url}/admin/login/'}, allow_redirects=True)
if resp.status_code not in (200, 302):
    print('Login failed; status:', resp.status_code)
    sys.exit(1)

admin_page = session.get(f'{admin_url}/admin/')
has_logo = re.search(r"/static/images/godwin.jpg", admin_page.text) is not None
has_css = re.search(r"/static/admin/css/custom_admin.css", admin_page.text) is not None
print('Admin page contains logo:', has_logo)
print('Admin page references custom CSS:', has_css)

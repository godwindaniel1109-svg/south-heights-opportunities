import os
import re
import sys
import time
import requests

admin_url = os.environ.get('ADMIN_URL', 'http://127.0.0.1:8000')
username = os.environ.get('ADMIN_USERNAME')
password = os.environ.get('ADMIN_PASSWORD')

if not username or not password:
    print('Please set ADMIN_USERNAME and ADMIN_PASSWORD environment variables and restart this script.')
    sys.exit(1)

session = requests.Session()
login_page = session.get(f'{admin_url}/admin/login/')
if login_page.status_code != 200:
    print('Could not reach admin login page. Status code:', login_page.status_code)
    sys.exit(1)

# Find csrfmiddlewaretoken
match = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', login_page.text)
csrf = match.group(1) if match else None
if not csrf:
    print('CSRF token not found.')
    sys.exit(1)

data = {
    'username': username,
    'password': password,
    'csrfmiddlewaretoken': csrf,
    'next': '/admin/'
}
headers = {'Referer': f'{admin_url}/admin/login/'}
resp = session.post(f'{admin_url}/admin/login/?next=/admin/', data=data, headers=headers, allow_redirects=False)

if resp.status_code == 302 and 'Location' in resp.headers and resp.headers['Location'].startswith('/admin/'):
    print('Admin login successful. Redirected to /admin/')
    print('Admin URL:', f'{admin_url}/admin/')
else:
    print('Admin login failed. Status code:', resp.status_code)
    print('Response headers:', resp.headers)
    print('Make sure Django server is running and credentials are correct.')

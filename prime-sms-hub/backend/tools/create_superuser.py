import os
import sys
import django
from django.contrib.auth import get_user_model

# Move into backend to find Django project module
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')
django.setup()

User = get_user_model()

# Read credentials from environment variables if present, otherwise prompt
username = os.environ.get('ADMIN_USERNAME') or input('Admin username: ')
email = os.environ.get('ADMIN_EMAIL') or input('Admin email: ')
password = os.environ.get('ADMIN_PASSWORD') or input('Admin password: ')

u = User.objects.filter(username=username).first()
if u:
    print(f'User {username} exists, updating password and flags.')
    u.email = email
    u.set_password(password)
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print('Updated existing user:', username)
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print('Created superuser:', username)

print('Done.')

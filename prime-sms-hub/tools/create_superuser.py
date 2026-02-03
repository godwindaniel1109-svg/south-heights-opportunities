import os
import sys
import django
from django.contrib.auth import get_user_model

# Ensure backend is importable (project package prime_sms lives in backend)
backend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'backend')
sys.path.insert(0, backend_dir)
# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')
django.setup()

User = get_user_model()
username = 'Godwin Daniel'
email = 'admin@example.com'  # CHANGE THIS
password = 'CHANGE_THIS_PASSWORD'  # CHANGE THIS

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

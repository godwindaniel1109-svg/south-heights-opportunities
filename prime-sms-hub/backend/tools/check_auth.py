#!/usr/bin/env python3
import os, sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')
import django
django.setup()
from django.contrib.auth import authenticate, get_user_model
if len(sys.argv) < 3:
    print('Usage: check_auth.py <email> <password>')
    sys.exit(2)
email = sys.argv[1]
password = sys.argv[2]
User = get_user_model()
user = User.objects.filter(email=email).first()
if not user:
    print('NO_USER')
    sys.exit(0)
auth = authenticate(username=user.username, password=password)
print('AUTH_OK' if auth else 'AUTH_FAIL')

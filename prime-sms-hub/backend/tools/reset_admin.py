#!/usr/bin/env python3
import os
import sys
import django

# Bootstrap Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')
django.setup()

from django.contrib.auth import get_user_model

if len(sys.argv) < 3:
    print("Usage: python reset_admin.py <email> <password>")
    sys.exit(2)

email = sys.argv[1]
password = sys.argv[2]
User = get_user_model()
user = User.objects.filter(email=email).first()
if user:
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print('UPDATED', user.username, user.email)
else:
    uname = email.split('@')[0]
    u = User.objects.create_user(username=uname, email=email, password=password)
    u.is_staff = True
    u.is_superuser = True
    u.save()
    print('CREATED', u.username, u.email)

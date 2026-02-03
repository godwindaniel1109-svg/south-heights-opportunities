"""
WSGI entry point for Vercel deployment
"""
import os
import sys
from django.core.wsgi import get_wsgi_application

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')

application = get_wsgi_application()

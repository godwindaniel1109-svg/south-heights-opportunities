"""
WSGI config for prime_sms project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')

application = get_wsgi_application()

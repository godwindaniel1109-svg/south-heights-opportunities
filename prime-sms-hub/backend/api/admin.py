"""
Simplified admin loader: delegate registration to advanced_admin.py
This avoids duplicate model registrations when advanced_admin handles customization.
"""
from . import advanced_admin

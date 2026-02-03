"""
One-time migration helper for Vercel deployment
Run this after first deployment to set up database tables

Usage: Add this endpoint temporarily, call it once, then remove it
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.management import call_command
from io import StringIO
import os

@api_view(['POST'])
@permission_classes([AllowAny])
def run_migrations(request):
    """
    One-time migration endpoint for Vercel
    SECURITY: Remove this after first migration!
    """
    # Simple secret check (change this!)
    secret = request.data.get('secret') or request.query_params.get('secret')
    expected_secret = os.environ.get('MIGRATION_SECRET', 'change-this-secret')
    
    if secret != expected_secret:
        return Response({'error': 'Forbidden'}, status=403)
    
    try:
        out = StringIO()
        call_command('migrate', verbosity=2, stdout=out, no_input=True)
        output = out.getvalue()
        return Response({
            'status': 'success',
            'output': output,
            'message': 'Migrations completed successfully'
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=500)

from django.http import HttpResponse
from django.conf import settings
import os


def index(request):
    """Serve repo root index.html for convenience at /"""
    index_path = os.path.join(settings.BASE_DIR, '..', 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    return HttpResponse('Index file not found', status=404)

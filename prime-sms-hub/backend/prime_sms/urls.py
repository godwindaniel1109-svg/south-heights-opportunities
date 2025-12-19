"""
URL configuration for prime_sms project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as static_serve
from rest_framework.routers import DefaultRouter
from .views import index as root_index
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('', root_index, name='root_index'),
]

if settings.DEBUG:
    # Map common frontend asset folders to repo root so URLs like /css/style.css work
    repo_root = os.path.join(settings.BASE_DIR, '..')
    urlpatterns += [
        re_path(r'^css/(?P<path>.*)$', static_serve, {'document_root': os.path.join(repo_root, 'css')}),
        re_path(r'^js/(?P<path>.*)$', static_serve, {'document_root': os.path.join(repo_root, 'js')}),
        re_path(r'^images/(?P<path>.*)$', static_serve, {'document_root': os.path.join(repo_root, 'images')}),
        re_path(r'^(?P<path>.*\.html)$', static_serve, {'document_root': repo_root}),
    ]
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

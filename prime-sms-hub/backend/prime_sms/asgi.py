"""
ASGI config for prime_sms project, enabling Channels for WebSocket support.
"""
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prime_sms.settings')

# Django ASGI application to handle traditional HTTP
django_asgi_app = get_asgi_application()

from api.consumers import NotificationsConsumer, SupportConsumer

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/notifications/', NotificationsConsumer.as_asgi()),
            path('ws/support/<int:conv_id>/', SupportConsumer.as_asgi()),
        ])
    ),
})

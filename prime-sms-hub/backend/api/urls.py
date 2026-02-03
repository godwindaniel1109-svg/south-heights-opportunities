from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check, firebase_config, UserViewSet, TransactionViewSet,
    PhoneNumberViewSet, WalletViewSet, NotificationViewSet,
    admin_stats, admin_system_status, paystack_webhook, SupportViewSet, telegram_webhook,
    admin_login_api
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'phone-numbers', PhoneNumberViewSet, basename='phonenumber')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'support', SupportViewSet, basename='support')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health_check'),
    path('firebase-config/', firebase_config, name='firebase_config'),
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('admin/system-status/', admin_system_status, name='admin_system_status'),
    path('payments/paystack/webhook/', paystack_webhook, name='paystack_webhook'),
    path('support/telegram/webhook/', telegram_webhook, name='telegram_webhook'),
    path('auth/admin/login/', admin_login_api, name='admin_login_api'),
]

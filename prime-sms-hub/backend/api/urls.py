from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check, firebase_config, UserViewSet, TransactionViewSet,
    PhoneNumberViewSet, WalletViewSet, NotificationViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'phone-numbers', PhoneNumberViewSet, basename='phonenumber')
router.register(r'wallet', WalletViewSet, basename='wallet')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health_check'),
    path('firebase-config/', firebase_config, name='firebase_config'),
]

from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.admin.sites import AdminSite
from django.contrib.messages.storage.fallback import FallbackStorage

from api.advanced_admin import CustomUserAdmin


class DummyRequest:
    def __init__(self):
        self._messages = []

    def _get_messages(self):
        return self._messages


class AdminUserActionsTest(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.admin = CustomUserAdmin(User, self.site)
        self.user1 = User.objects.create_user('u1', email='u1@example.com', password='pass')
        self.user2 = User.objects.create_user('u2', email='u2@example.com', password='pass')

    def test_ban_and_activate_actions(self):
        request = DummyRequest()
        # Attach messages storage used by admin.message_user
        request.session = {}
        request._messages = FallbackStorage(request)
        qs = User.objects.filter(username__in=['u1', 'u2'])
        # ban users
        self.admin.ban_users(request, qs)
        self.user1.refresh_from_db()
        self.user2.refresh_from_db()
        self.assertFalse(self.user1.is_active)
        self.assertFalse(self.user2.is_active)

        # activate users
        self.admin.activate_users(request, qs)
        self.user1.refresh_from_db()
        self.user2.refresh_from_db()
        self.assertTrue(self.user1.is_active)
        self.assertTrue(self.user2.is_active)

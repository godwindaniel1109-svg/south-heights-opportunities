from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from ..models import Notification


class NotificationAPITests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@example.com', 'password')
        self.user = User.objects.create_user('bob', 'bob@example.com', 'password')
        self.client = APIClient()

    def test_admin_can_send_notification_to_user(self):
        self.client.force_authenticate(user=self.admin)
        resp = self.client.post('/api/notifications/', {
            'user': self.user.id,
            'title': 'Test',
            'message': 'Hello',
            'type': 'info'
        })
        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Notification.objects.filter(user=self.user).count(), 1)

    def test_user_sees_unread_count_and_can_mark_read(self):
        Notification.objects.create(user=self.user, title='N1', message='m', type='info')
        Notification.objects.create(user=self.user, title='N2', message='m', type='info')

        self.client.force_authenticate(user=self.user)
        count_resp = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(count_resp.status_code, 200)
        self.assertEqual(count_resp.json().get('unread'), 2)

        list_resp = self.client.get('/api/notifications/')
        self.assertEqual(list_resp.status_code, 200)
        items = list_resp.json()
        item = items[0] if isinstance(items, list) else items.get('results')[0]

        # mark single read
        mid = item['id']
        mark_resp = self.client.post(f'/api/notifications/{mid}/mark_read/')
        self.assertEqual(mark_resp.status_code, 200)

        count_resp2 = self.client.get('/api/notifications/unread_count/')
        self.assertEqual(count_resp2.json().get('unread'), 1)

    def test_mark_all_read(self):
        Notification.objects.create(user=self.user, title='N1', message='m', type='info')
        Notification.objects.create(user=self.user, title='N2', message='m', type='info')
        self.client.force_authenticate(user=self.user)
        all_resp = self.client.post('/api/notifications/mark_all_read/')
        self.assertEqual(all_resp.status_code, 200)
        self.assertEqual(Notification.objects.filter(user=self.user, is_read=False).count(), 0)

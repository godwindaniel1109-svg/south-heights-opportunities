from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient


class ProfileNotifySoundAPITest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('notifuser', password='pass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_toggle_notify_sound_via_api(self):
        resp = self.client.patch('/api/users/profile/', {'notify_sound': 'false'}, format='multipart')
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('profile', data)
        self.assertFalse(data['profile']['notify_sound'])

        # set it back to true
        resp2 = self.client.patch('/api/users/profile/', {'notify_sound': 'true'}, format='multipart')
        self.assertEqual(resp2.status_code, 200)
        self.assertTrue(resp2.json()['profile']['notify_sound'])

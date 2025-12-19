from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile

from api.models import Notification
from api.serializers import NotificationSerializer


class NotificationSerializerTest(TestCase):
    def test_serializer_includes_user_avatar_and_display(self):
        u = User.objects.create_user('avataruser', password='pass')
        profile = u.profile
        # attach a simple uploaded file
        img = SimpleUploadedFile('avatar.jpg', b'jpegdata', content_type='image/jpeg')
        profile.avatar.save('avatar.jpg', img, save=True)

        n = Notification.objects.create(user=u, title='Hi', message='Check this', link='/profile', type='info')
        s = NotificationSerializer(n)
        data = s.data
        self.assertEqual(data['user_display'], u.username)
        # user_avatar should be present and non-empty
        self.assertTrue(data.get('user_avatar'))

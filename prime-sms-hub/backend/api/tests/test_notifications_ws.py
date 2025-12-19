import asyncio
from channels.testing.websocket import WebsocketCommunicator
from django.test import TestCase
from django.contrib.auth.models import User

from prime_sms.asgi import application
from api.models import Notification
from channels.layers import get_channel_layer


class NotificationsWSTest(TestCase):
    def test_global_notification_received(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        communicator = WebsocketCommunicator(application, "/ws/notifications/")
        connected, _ = loop.run_until_complete(communicator.connect())
        self.assertTrue(connected)

        # Create a global notification (no user) and expect the websocket to receive it
        Notification.objects.create(title='Global', message='Hello all', link='', type='info')

        data = loop.run_until_complete(communicator.receive_json_from(timeout=1))
        self.assertEqual(data.get('type'), 'notification')
        notif = data.get('notification')
        self.assertIsNotNone(notif)
        self.assertEqual(notif.get('title'), 'Global')

        loop.run_until_complete(communicator.disconnect())

    def test_user_notification_received_only_by_user_group(self):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        user = User.objects.create_user('wsuser', password='pass')

        # connect websocket and register the channel into the user's group manually
        communicator = WebsocketCommunicator(application, "/ws/notifications/")
        connected, _ = loop.run_until_complete(communicator.connect())
        self.assertTrue(connected)

        # ask the consumer to subscribe this connection to the user's group
        loop.run_until_complete(communicator.send_json_to({'command': 'subscribe_user', 'user_id': user.id}))
        # give the consumer a moment to process the subscribe
        loop.run_until_complete(asyncio.sleep(0.05))

        # send a notification targeted at this user
        Notification.objects.create(user=user, title='Private', message='Hello you', link='', type='message')

        data = loop.run_until_complete(communicator.receive_json_from(timeout=1))
        self.assertEqual(data.get('type'), 'notification')
        notif = data.get('notification')
        self.assertIsNotNone(notif)
        self.assertEqual(notif.get('title'), 'Private')

        loop.run_until_complete(communicator.disconnect())

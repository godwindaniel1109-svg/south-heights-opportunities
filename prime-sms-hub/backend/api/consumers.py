from channels.generic.websocket import AsyncJsonWebsocketConsumer

class NotificationsConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope.get('user')
        # Accept connection for both authenticated and anonymous users
        await self.accept()
        # Add to global group
        await self.channel_layer.group_add('global_notifications', self.channel_name)
        if user and user.is_authenticated:
            self.user_group = f'user_{user.id}'
            await self.channel_layer.group_add(self.user_group, self.channel_name)

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard('global_notifications', self.channel_name)
            if hasattr(self, 'user_group'):
                await self.channel_layer.group_discard(self.user_group, self.channel_name)
        except Exception:
            pass

    async def notification_message(self, event):
        # Event payload includes 'notification' dict
        payload = event.get('notification')
        await self.send_json({'type': 'notification', 'notification': payload})

    async def receive_json(self, content, **kwargs):
        # Allow simple subscribe/unsubscribe commands for test and lightweight clients
        cmd = content.get('command')
        if cmd == 'subscribe_user':
            user_id = content.get('user_id')
            if user_id:
                await self.channel_layer.group_add(f'user_{user_id}', self.channel_name)
        elif cmd == 'unsubscribe_user':
            user_id = content.get('user_id')
            if user_id:
                await self.channel_layer.group_discard(f'user_{user_id}', self.channel_name)
        elif cmd == 'subscribe_global':
            await self.channel_layer.group_add('global_notifications', self.channel_name)
        elif cmd == 'unsubscribe_global':
            await self.channel_layer.group_discard('global_notifications', self.channel_name)


# Support consumer for per-conversation real-time chat
class SupportConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.conv_id = self.scope['url_route']['kwargs'].get('conv_id')
        self.group_name = f'support_conv_{self.conv_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # received payloads are ignored for now (client should use REST to post messages)
        return

    async def support_message(self, event):
        payload = event.get('message')
        await self.send_json({'type': 'support_message', 'message': payload})

from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
import channels.layers
from asgiref.sync import async_to_sync

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('purchase', 'Purchase Number'),
        ('fund', 'Fund Wallet'),
        ('refund', 'Refund'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reference = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    credited = models.BooleanField(default=False)
    # Optional proof of payment (bank transfer receipt)
    proof = models.FileField(upload_to='proofs/', null=True, blank=True)
    VERIFICATION_STATUS_CHOICES = [
        ('pending', 'Pending Verification'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_STATUS_CHOICES, default='pending')
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.reference}"


class PhoneNumber(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('expired', 'Expired'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='phone_numbers')
    phone_number = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    service = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    expires_at = models.DateTimeField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    activation_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.phone_number} - {self.service}"


class SMSMessage(models.Model):
    phone_number = models.ForeignKey(PhoneNumber, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=100)
    content = models.TextField()
    received_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-received_at']
    
    def __str__(self):
        return f"SMS from {self.sender}"


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='USD')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Wallet - {self.user.username}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(blank=True)
    notify_sound = models.BooleanField(default=True)

    def __str__(self):
        return f"Profile - {self.user.username}"


from django.utils import timezone

class Conversation(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations', null=True, blank=True)
    page = models.CharField(max_length=255, blank=True, default='support')
    telegram_chat_id = models.BigIntegerField(null=True, blank=True)
    telegram_message_id = models.BigIntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    last_message_time = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_message_time']

    def __str__(self):
        return f"Conversation {self.id} - {self.user or 'Anonymous'}"


class SupportMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('system', 'System')
    ]

    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    sender_user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    telegram_message_id = models.BigIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender} - {self.conversation.id} - {self.created_at}"


class Notification(models.Model):
    NOTIF_TYPE_CHOICES = [
        ('info', 'Info'),
        ('alert', 'Alert'),
        ('approval', 'Approval'),
        ('message', 'Message'),
        ('promo', 'Promotion'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=512, blank=True)
    type = models.CharField(max_length=20, choices=NOTIF_TYPE_CHOICES, default='info')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        target = self.user.username if self.user else 'ALL'
        return f"Notification to {target} - {self.title}"


@receiver(post_save, sender=Notification)
def broadcast_notification(sender, instance, created, **kwargs):
    """Send real-time notification to connected users via Channels"""
    if not created:
        return

    channel_layer = channels.layers.get_channel_layer()
    payload = {
        'id': instance.id,
        'title': instance.title,
        'message': instance.message,
        'link': instance.link,
        'type': instance.type,
        'created_at': instance.created_at.isoformat(),
        'is_read': instance.is_read,
    }
    # include user info for richer client rendering
    if instance.user:
        try:
            avatar = instance.user.profile.avatar.url
        except Exception:
            avatar = None
        payload['user'] = {
            'id': instance.user.id,
            'username': instance.user.username,
            'avatar': avatar,
        }
    else:
        payload['user'] = None

    try:
        if instance.user:
            group = f'user_{instance.user.id}'
            async_to_sync(channel_layer.group_send)(group, {'type': 'notification.message', 'notification': payload})
        else:
            async_to_sync(channel_layer.group_send)('global_notifications', {'type': 'notification.message', 'notification': payload})
    except Exception:
        # Fail silently in environments without Channels configured
        pass


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
        # Create wallet for the user as well to ensure profile and wallet exist
        Wallet.objects.get_or_create(user=instance)


@receiver(post_save, sender=Transaction)
def handle_transaction_completed(sender, instance, created, **kwargs):
    # Update wallet when transaction becomes completed and it's a fund
    # Avoid double processing by only applying the balance change when status is completed and not previously completed
    if instance.transaction_type == 'fund' and instance.status == 'completed' and not instance.credited:
        try:
            wallet = instance.user.wallet
            # Here we assume that transaction should only be applied once
            # To prevent double-applying, you could add a flag or check if a wallet transaction log exists.
            # For simplicity, we'll update wallet balance if the transaction was just completed (created or not)
            wallet.balance = wallet.balance + instance.amount
            wallet.save()
            # Mark transaction as credited
            if not instance.credited:
                instance.credited = True
                instance.save(update_fields=['credited'])
        except Wallet.DoesNotExist:
            # Create wallet automatically if it doesn't exist and apply balance
            wallet = Wallet.objects.create(user=instance.user, balance=instance.amount)
            instance.credited = True
            instance.save(update_fields=['credited'])

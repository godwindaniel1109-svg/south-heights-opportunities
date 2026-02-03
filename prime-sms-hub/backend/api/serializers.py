from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, PhoneNumber, SMSMessage, Wallet, Notification


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']

    def get_profile(self, obj):
        try:
            return {
                'avatar': obj.profile.avatar.url if obj.profile.avatar else None,
                'bio': obj.profile.bio,
                'notify_sound': obj.profile.notify_sound,
            }
        except Exception:
            return None


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'currency', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'transaction_type', 'amount', 'status', 'reference', 'description', 'created_at', 'updated_at', 'credited', 'proof', 'verification_status']


class SMSMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMSMessage
        fields = ['id', 'sender', 'content', 'received_at']


class PhoneNumberSerializer(serializers.ModelSerializer):
    messages = SMSMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = PhoneNumber
        fields = ['id', 'phone_number', 'country', 'service', 'status', 'expires_at', 'price', 'created_at', 'messages']


class NotificationSerializer(serializers.ModelSerializer):
    user_display = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'user', 'user_display', 'user_avatar', 'title', 'message', 'link', 'type', 'is_read', 'created_at']

    def get_user_display(self, obj):
        return obj.user.username if obj.user else 'ALL'

    def get_user_avatar(self, obj):
        try:
            return obj.user.profile.avatar.url
        except Exception:
            return None


# === Support Chat Serializers ===
from .models import Conversation, SupportMessage


class SupportMessageSerializer(serializers.ModelSerializer):
    sender_display = serializers.SerializerMethodField()

    class Meta:
        model = SupportMessage
        fields = ['id', 'conversation', 'sender', 'sender_user', 'sender_display', 'content', 'telegram_message_id', 'created_at']

    def get_sender_display(self, obj):
        if obj.sender == 'user' and obj.sender_user:
            return obj.sender_user.email or obj.sender_user.username
        return obj.sender


class ConversationSerializer(serializers.ModelSerializer):
    messages = SupportMessageSerializer(many=True, read_only=True)
    user_display = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user', 'user_display', 'page', 'telegram_chat_id', 'telegram_message_id', 'status', 'last_message_time', 'created_at', 'messages']

    def get_user_display(self, obj):
        try:
            return obj.user.email or obj.user.username
        except Exception:
            return None

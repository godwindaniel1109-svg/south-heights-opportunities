from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
import logging
from django.db.models import Q
from rest_framework.authtoken.models import Token
from rest_framework.decorators import permission_classes
from rest_framework.parsers import JSONParser

from .models import Transaction, PhoneNumber, Wallet, SMSMessage
from .serializers import (
    UserSerializer, TransactionSerializer, PhoneNumberSerializer,
    WalletSerializer, SMSMessageSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import NotificationSerializer
from .models import Notification
from .services import PaystackService, FiveSimService, EmailService, FirebaseService, TelegramService
from django.utils import timezone
from django.db.models import Sum, Count
from datetime import timedelta
import hmac
import hashlib
import json
import csv
import io
from django.http import HttpResponse
from django.conf import settings

logger = logging.getLogger(__name__)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'ok',
        'message': 'Prime SMS Hub Backend is running'
    })


@api_view(['GET'])
def firebase_config(request):
    """Get Firebase configuration"""
    firebase_service = FirebaseService()
    return Response(firebase_service.get_config())


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login_api(request):
    """Admin login via email/password. Returns auth token on success."""
    data = request.data if isinstance(request.data, dict) else JSONParser().parse(request)
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.filter(email=email).first()
    if not user:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    from django.contrib.auth import authenticate
    auth_user = authenticate(username=user.username, password=password)
    if not auth_user or not auth_user.is_staff:
        return Response({'error': 'Invalid credentials or not admin'}, status=status.HTTP_400_BAD_REQUEST)

    token, _ = Token.objects.get_or_create(user=auth_user)
    return Response({'token': token.key, 'username': auth_user.username, 'email': auth_user.email})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Admin/staff can see all users.
        Regular authenticated users should NOT be able to list all users.
        """
        if getattr(self.request.user, 'is_staff', False):
            qs = User.objects.all()
        else:
            qs = User.objects.filter(id=self.request.user.id)

        q = self.request.query_params.get('q')
        status_q = (self.request.query_params.get('status') or '').lower()
        if q:
            qs = qs.filter(Q(email__icontains=q) | Q(username__icontains=q) | Q(first_name__icontains=q) | Q(last_name__icontains=q))
        if status_q:
            if status_q == 'active':
                qs = qs.filter(is_active=True)
            elif status_q in ('suspended', 'banned', 'inactive'):
                qs = qs.filter(is_active=False)
        return qs.order_by('-date_joined')

    def retrieve(self, request, *args, **kwargs):
        # Only staff can view other users
        if not request.user.is_staff and str(kwargs.get('pk')) != str(request.user.id):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return super().retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        u = get_object_or_404(User, pk=pk)
        u.is_active = False
        u.save(update_fields=['is_active'])
        return Response({'status': 'suspended', 'user': UserSerializer(u).data})

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        u = get_object_or_404(User, pk=pk)
        u.is_active = True
        u.save(update_fields=['is_active'])
        return Response({'status': 'active', 'user': UserSerializer(u).data})
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post', 'patch'], parser_classes=[MultiPartParser, FormParser])
    def profile(self, request):
        """Update current user's profile (avatar, bio, notify_sound)"""
        user = request.user
        data = request.data
        profile = user.profile
        # handle boolean notify_sound explicitly
        if 'notify_sound' in data:
            ns = data.get('notify_sound')
            # form data booleans can be strings
            if isinstance(ns, str):
                ns = ns.lower() in ('1', 'true', 'yes', 'on')
            profile.notify_sound = bool(ns)

        if 'bio' in data:
            profile.bio = data.get('bio')

        if 'avatar' in request.FILES:
            profile.avatar = request.FILES.get('avatar')

        profile.save()
        return Response({'profile': {
            'avatar': profile.avatar.url if profile.avatar else None,
            'bio': profile.bio,
            'notify_sound': profile.notify_sound
        }})
    
    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Logout user"""
        return Response({'message': 'Logged out successfully'})


class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get transactions for current user"""
        return Transaction.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """Create a new transaction"""
        user = request.user
        transaction_type = request.data.get('transaction_type')
        amount = float(request.data.get('amount', 0))
        
        if transaction_type == 'fund':
            paystack_service = PaystackService()
            result = paystack_service.initialize_transaction(
                email=user.email,
                amount=amount,
                metadata={'user_id': user.id, 'type': transaction_type}
            )
            
            if result.get('status'):
                # Create transaction record
                transaction = Transaction.objects.create(
                    user=user,
                    transaction_type=transaction_type,
                    amount=amount,
                    status='pending',
                    reference=result['data']['reference'],
                    description='Wallet funding'
                )
                return Response({
                    'transaction': TransactionSerializer(transaction).data,
                    'payment_url': result['data']['authorization_url']
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': result.get('message')}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'error': 'Invalid transaction type'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_payment(self, request):
        """Verify a payment"""
        reference = request.data.get('reference')
        paystack_service = PaystackService()
        result = paystack_service.verify_transaction(reference)
        
        if result.get('status') and result['data']['status'] == 'success':
            # Update transaction
            transaction = get_object_or_404(Transaction, reference=reference)
            transaction.status = 'completed'
            transaction.save()
            
            # Update wallet
            wallet, _ = Wallet.objects.get_or_create(user=request.user)
            wallet.balance += transaction.amount
            wallet.save()
            
            # Send confirmation email
            email_service = EmailService()
            email_service.send_transaction_confirmation(request.user.email, transaction)
            
            return Response({
                'message': 'Payment verified successfully',
                'transaction': TransactionSerializer(transaction).data
            })
        
        return Response({'error': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)


class PhoneNumberViewSet(viewsets.ModelViewSet):
    serializer_class = PhoneNumberSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Get phone numbers for current user"""
        return PhoneNumber.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def buy_number(self, request):
        """Buy a phone number"""
        user = request.user
        country = request.data.get('country')
        service = request.data.get('service')
        amount = float(request.data.get('amount', 0))
        
        # Check wallet balance - must be greater than or equal to amount
        wallet, _ = Wallet.objects.get_or_create(user=user)
        if wallet.balance < amount:
            return Response({'error': f'Insufficient wallet balance. Your balance is ₦{wallet.balance:.2f}, but you need ₦{amount:.2f}'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Buy from 5SIM
        fivesim_service = FiveSimService()
        result = fivesim_service.buy_number(country, service)
        
        if result.get('status'):
            # Deduct from wallet
            wallet.balance -= amount
            wallet.save()
            
            # Create phone number record
            phone_number = PhoneNumber.objects.create(
                user=user,
                phone_number=result['data']['phone'],
                country=country,
                service=service,
                status='active',
                expires_at=result['data']['expires'],
                price=amount,
                activation_id=result['data']['id']
            )
            
            # Log transaction
            Transaction.objects.create(
                user=user,
                transaction_type='purchase',
                amount=amount,
                status='completed',
                reference=f"PURCHASE-{phone_number.id}",
                description=f"Purchased {service} number in {country}"
            )
            
            return Response(
                PhoneNumberSerializer(phone_number).data,
                status=status.HTTP_201_CREATED
            )
        
        return Response({'error': result.get('message')}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def available_numbers(self, request):
        """Get available phone numbers and prices"""
        fivesim_service = FiveSimService()
        result = fivesim_service.get_prices()

        # Optional filtering by country code (e.g., US, CA) and service
        country = request.query_params.get('country')
        service = request.query_params.get('service')

        def matches(item, country, service):
            if not isinstance(item, dict):
                return False
            if country and not (item.get('country') == country or item.get('iso') == country or item.get('code') == country):
                return False
            if service:
                # service might be in keys like 'services' or 'product'
                # check if service exists in item values
                vals = str(item.get('services') or item.get('service') or '')
                if isinstance(vals, dict):
                    if service not in vals.keys() and service not in vals.values():
                        return False
                else:
                    if service not in vals:
                        return False
            return True

        # If the service returned a list, filter directly
        if isinstance(result, list):
            filtered = [item for item in result if matches(item, country, service)]
            return Response(filtered)

        # If a dict was returned, try to find list values and filter
        if isinstance(result, dict):
            # Collect any list-like entries
            lists = [v for v in result.values() if isinstance(v, list)]
            aggregated = []
            for lst in lists:
                for item in lst:
                    if matches(item, country, service):
                        aggregated.append(item)
            if aggregated:
                return Response(aggregated)

        # If no filters applied, return raw result
        return Response(result)


class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        """Get wallet balance"""
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get wallet balance for a specific user (admin only)"""
        if not request.user.is_staff:
            return Response({'error': 'Permission denied. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({'error': 'user_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            target_user = User.objects.get(pk=user_id)
            wallet, _ = Wallet.objects.get_or_create(user=target_user)
            serializer = WalletSerializer(wallet)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['post'])
    def add_funds(self, request):
        """Add funds to wallet (via payment) - includes 5 naira service charge"""
        wallet_amount = float(request.data.get('amount', 0))  # Amount to credit to wallet
        SERVICE_CHARGE = 5.0  # 5 naira service charge
        total_amount = wallet_amount + SERVICE_CHARGE  # Total amount user pays
        
        paystack_service = PaystackService()
        result = paystack_service.initialize_transaction(
            email=request.user.email,
            amount=total_amount,  # User pays wallet_amount + 5 naira
            metadata={'user_id': request.user.id, 'type': 'fund', 'wallet_amount': wallet_amount, 'service_charge': SERVICE_CHARGE}
        )
        
        if result.get('status'):
            Transaction.objects.create(
                user=request.user,
                transaction_type='fund',
                amount=wallet_amount,  # Only wallet amount is credited (service charge is deducted)
                status='pending',
                reference=result['data']['reference'],
                description=f'Wallet funding (User paid ₦{total_amount:.2f}: ₦{wallet_amount:.2f} credited + ₦{SERVICE_CHARGE:.2f} service charge)'
            )
            return Response({
                'payment_url': result['data']['authorization_url'],
                'reference': result['data']['reference'],
                'wallet_amount': wallet_amount,
                'service_charge': SERVICE_CHARGE,
                'total_amount': total_amount
            })
        
        return Response({'error': result.get('message')}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def approve_deposit(self, request):
        """Approve a pending manual deposit transaction (admin only)"""
        # Check if user is staff/admin
        if not request.user.is_staff:
            return Response({'error': 'Permission denied. Admin access required.'}, status=status.HTTP_403_FORBIDDEN)
        
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'Reference is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            transaction = Transaction.objects.get(reference=reference, transaction_type='fund', status='pending')
        except Transaction.DoesNotExist:
            return Response({'error': 'Transaction not found or already processed'}, status=status.HTTP_404_NOT_FOUND)
        
        # Mark transaction as completed; the Transaction post_save signal will credit wallet exactly once
        transaction.status = 'completed'
        transaction.verification_status = 'approved'
        transaction.credited = False
        transaction.save(update_fields=['status', 'verification_status', 'credited'])
        
        # Send notification to user
        try:
            Notification.objects.create(
                user=transaction.user,
                title='Deposit Approved',
                message=f'Your deposit of ₦{transaction.amount:.2f} has been approved and credited to your wallet.',
                type='success'
            )
        except Exception:
            logger.exception('Failed to create notification')
        
        return Response({
            'message': 'Deposit approved successfully',
            'transaction': TransactionSerializer(transaction).data
        })

    @action(detail=False, methods=['post'])
    def admin_adjust(self, request):
        """Admin-only wallet adjustment. Either add a delta or set an absolute balance."""
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user_id')
        delta = request.data.get('delta')
        absolute = request.data.get('absolute')
        reason = (request.data.get('reason') or '').strip()

        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        if delta is None and absolute is None:
            return Response({'error': 'Provide delta or absolute'}, status=status.HTTP_400_BAD_REQUEST)

        target_user = get_object_or_404(User, pk=user_id)
        wallet, _ = Wallet.objects.get_or_create(user=target_user)

        if absolute is not None:
            wallet.balance = float(absolute)
        else:
            wallet.balance = float(wallet.balance) + float(delta)
        wallet.save()

        # Record an admin transaction for audit trail
        Transaction.objects.create(
            user=target_user,
            transaction_type='fund',
            amount=0,
            status='completed',
            reference=f'ADMIN-ADJUST-{timezone.now().strftime("%Y%m%d%H%M%S")}-{target_user.id}',
            description=f'Admin wallet adjustment. {("Set" if absolute is not None else "Delta")}={absolute if absolute is not None else delta}. {reason}'.strip()
        )

        return Response({'message': 'Wallet updated', 'wallet': WalletSerializer(wallet).data})
    
    @action(detail=False, methods=['post'])
    def upload_proof(self, request):
        """Upload proof of manual bank transfer and create pending transaction for verification
        Note: User should transfer (amount + 5 naira service charge), but only 'amount' is credited to wallet
        """
        SERVICE_CHARGE = 5.0  # 5 naira service charge
        wallet_amount = float(request.data.get('amount', 0))  # Amount to credit to wallet
        total_transferred = wallet_amount + SERVICE_CHARGE  # Total amount user should have transferred
        
        proof_file = request.FILES.get('proof')
        reference = request.data.get('reference', '').strip()

        # Basic validation
        if wallet_amount <= 0:
            return Response({'error': 'Invalid amount. Minimum is ₦1'}, status=status.HTTP_400_BAD_REQUEST)
        if not proof_file:
            return Response({'error': 'Proof file is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not reference:
            return Response({'error': 'Transaction reference is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a reference if not provided
        import uuid
        if not reference:
            reference = f'PROOF-{uuid.uuid4().hex[:10].upper()}'

        tx = Transaction.objects.create(
            user=request.user,
            transaction_type='fund',
            amount=wallet_amount,  # Only wallet amount is credited (service charge is deducted)
            status='pending',
            reference=reference,
            description=f'Manual bank transfer - ₦{wallet_amount:.2f} (You should have transferred ₦{total_transferred:.2f} including ₦{SERVICE_CHARGE:.2f} service charge)',
            proof=proof_file,
            verification_status='pending'
        )

        return Response({
            'message': f'Proof uploaded. Please ensure you transferred ₦{total_transferred:.2f} (₦{wallet_amount:.2f} + ₦{SERVICE_CHARGE:.2f} service charge). Only ₦{wallet_amount:.2f} will be credited to your wallet.',
            'transaction': TransactionSerializer(tx).data,
            'wallet_amount': wallet_amount,
            'service_charge': SERVICE_CHARGE,
            'total_transferred': total_transferred
        })


class NotificationViewSet(viewsets.ModelViewSet):
    """Manage user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.all().order_by('-created_at')
        # Only show notifications relevant to the user or broadcasts
        return qs.filter(Q(user=self.request.user) | Q(user__isnull=True))


@api_view(['GET'])
def admin_stats(request):
    """Return admin dashboard statistics. Access is allowed for staff users or via admin secret header."""


# === Support / Telegram webhook ===
from .models import Conversation, SupportMessage
from .serializers import ConversationSerializer, SupportMessageSerializer


class SupportViewSet(viewsets.ModelViewSet):
    """Manage support conversations and messages"""
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Base queryset: staff see all, users see their own.
        # Also allow access when a valid admin secret header is provided (for exports / API use).
        header_secret = self.request.headers.get('X-Admin-Secret') or self.request.META.get('HTTP_X_ADMIN_SECRET')
        configured_secret = getattr(settings, 'ADMIN_DASHBOARD_SECRET', 'dev-secret')
        is_admin_secret = header_secret == configured_secret

        qs = Conversation.objects.all() if (getattr(self.request.user, 'is_staff', False) or is_admin_secret) else Conversation.objects.filter(user=self.request.user)

        # Filtering params
        status = self.request.query_params.get('status')
        q = self.request.query_params.get('q')
        user_id = self.request.query_params.get('user_id')

        if status:
            qs = qs.filter(status=status)
        if user_id:
            qs = qs.filter(user__id=user_id)
        if q:
            qs = qs.filter(
                Q(user__email__icontains=q) |
                Q(user__username__icontains=q) |
                Q(id__iexact=q) |
                Q(messages__content__icontains=q)
            ).distinct()

        return qs.order_by('-last_message_time')

    def create(self, request, *args, **kwargs):
        # Start or append to a conversation
        user = request.user if request.user.is_authenticated else None
        message_text = request.data.get('message')
        page = request.data.get('page', 'support')

        # Find open conversation for user
        conv = None
        if user:
            conv = Conversation.objects.filter(user=user, status='open').first()
        if not conv:
            conv = Conversation.objects.create(user=user, page=page)

        # Create support message
        sm = SupportMessage.objects.create(conversation=conv, sender='user', sender_user=user, content=message_text)
        conv.last_message_time = sm.created_at
        conv.save()

        # Broadcast to websocket listeners for this conversation
        try:
            from asgiref.sync import async_to_sync
            from channels.layers import get_channel_layer
            channel_layer = get_channel_layer()
            payload = SupportMessageSerializer(sm).data
            async_to_sync(channel_layer.group_send)(f'support_conv_{conv.id}', {'type': 'support_message', 'message': payload})
        except Exception:
            logger.exception('Failed to broadcast support message')

        # Forward to Telegram
        ts = TelegramService()
        user_display = f"{user.email or user.username} (ID:{user.id})" if user else request.data.get('user_email', 'Anonymous')
        res = ts.send_to_admin(conv, user_display, message_text)
        if res.get('ok'):
            conv.telegram_chat_id = res.get('chat_id')
            conv.telegram_message_id = res.get('message_id')
            conv.save()
            sm.telegram_message_id = res.get('message_id')
            sm.save()

        return Response(ConversationSerializer(conv).data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conv = get_object_or_404(Conversation, pk=pk)
        # permission check
        if not (request.user.is_staff or conv.user == request.user):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        msgs = SupportMessage.objects.filter(conversation=conv)
        return Response(SupportMessageSerializer(msgs, many=True).data)

    @action(detail=True, methods=['post'])
    def post_message(self, request, pk=None):
        conv = get_object_or_404(Conversation, pk=pk)
        if conv.status != 'open':
            return Response({'error': 'Conversation closed'}, status=status.HTTP_400_BAD_REQUEST)
        if not (request.user.is_authenticated and (request.user.is_staff or conv.user == request.user)):
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        content = (request.data.get('content') or '').strip()
        if not content:
            return Response({'error': 'content is required'}, status=status.HTTP_400_BAD_REQUEST)

        sender = 'admin' if request.user.is_staff else 'user'
        sm = SupportMessage.objects.create(
            conversation=conv,
            sender=sender,
            sender_user=request.user if sender == 'user' else None,
            content=content
        )
        conv.last_message_time = sm.created_at
        conv.save(update_fields=['last_message_time'])

        # Broadcast over websockets
        try:
            from asgiref.sync import async_to_sync
            from channels.layers import get_channel_layer
            channel_layer = get_channel_layer()
            payload = SupportMessageSerializer(sm).data
            async_to_sync(channel_layer.group_send)(f'support_conv_{conv.id}', {'type': 'support_message', 'message': payload})
        except Exception:
            logger.exception('Failed to broadcast support message')

        # Forward to Telegram / reply to user
        ts = TelegramService()
        if sender == 'user':
            user_display = f"{request.user.email or request.user.username} (ID:{request.user.id})"
            res = ts.send_to_admin(conv, user_display, content)
            if res.get('ok'):
                conv.telegram_chat_id = res.get('chat_id')
                conv.telegram_message_id = res.get('message_id')
                conv.save(update_fields=['telegram_chat_id', 'telegram_message_id'])
                sm.telegram_message_id = res.get('message_id')
                sm.save(update_fields=['telegram_message_id'])
        else:
            ts.reply_to_user(conv, content)

        return Response(SupportMessageSerializer(sm).data)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        conv = get_object_or_404(Conversation, pk=pk)
        if not request.user.is_staff and conv.user != request.user:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        conv.status = 'closed'
        conv.save(update_fields=['status'])
        return Response({'status': 'closed'})

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def export(self, request):
        """Export conversations as CSV (staff or admin secret)"""
        header_secret = request.headers.get('X-Admin-Secret') or request.META.get('HTTP_X_ADMIN_SECRET')
        configured_secret = getattr(settings, 'ADMIN_DASHBOARD_SECRET', 'dev-secret')
        if not (request.user.is_authenticated and request.user.is_staff) and header_secret != configured_secret:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        qs = self.get_queryset()
        limit = request.query_params.get('limit')
        if limit:
            qs = qs[:int(limit)]

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(['conversation_id', 'user_id', 'user_email', 'page', 'status', 'last_message_time', 'created_at', 'messages'])

        for conv in qs:
            msgs = []
            for m in conv.messages.all():
                text = (m.content or '').replace('\n', ' ')
                msgs.append(f"{m.created_at.isoformat()}|{m.sender}|{text}")
            messages_str = ' || '.join(msgs)
            writer.writerow([
                conv.id,
                conv.user.id if conv.user else '',
                conv.user.email if conv.user else '',
                conv.page,
                conv.status,
                conv.last_message_time.isoformat() if conv.last_message_time else '',
                conv.created_at.isoformat(),
                messages_str
            ])

        resp = HttpResponse(buffer.getvalue(), content_type='text/csv')
        resp['Content-Disposition'] = 'attachment; filename="conversations_export.csv"'
        return resp


@api_view(['POST'])
@permission_classes([AllowAny])
def telegram_webhook(request):
    """Handle incoming Telegram updates (messages / replies). AllowAny is required because Telegram will POST without Authorization headers; we still validate the webhook secret token."""
    secret = getattr(settings, 'TELEGRAM_WEBHOOK_SECRET', None)
    header = request.headers.get('X-Telegram-Bot-Api-Secret-Token') or request.META.get('HTTP_X_TELEGRAM_BOT_API_SECRET_TOKEN')
    if secret and header != secret:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    payload = request.data
    message = payload.get('message') or payload.get('edited_message')
    if not message:
        return Response({'status': 'no message'})

    chat = message.get('chat')
    msg_id = message.get('message_id')
    text = message.get('text') or ''

    # If this is a reply to a bot-sent message, find matching conversation
    reply_to = message.get('reply_to_message')
    conv = None
    if reply_to:
        rt_id = reply_to.get('message_id')
        conv = Conversation.objects.filter(telegram_message_id=rt_id).first()

    # Fallback: try to find by chat id (last recent conversation with chat id)
    if not conv and chat:
        conv = Conversation.objects.filter(telegram_chat_id=chat.get('id')).order_by('-last_message_time').first()

    if not conv:
        # Unknown conversation; create a system conversation for this chat
        conv = Conversation.objects.create(user=None, page='telegram', telegram_chat_id=chat.get('id'))

    # Determine if this update came from the configured admin chat (an admin reply) or a user
    ts = TelegramService()
    admin_chat = getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', None)
    is_admin_message = False
    try:
        if chat and admin_chat and int(chat.get('id')) == int(admin_chat):
            is_admin_message = True
    except Exception:
        is_admin_message = False

    if is_admin_message:
        # Admin reply -> record admin message
        sm = SupportMessage.objects.create(conversation=conv, sender='admin', content=text, telegram_message_id=msg_id)
        conv.last_message_time = sm.created_at
        conv.save()

        # Broadcast admin reply to websocket listeners
        try:
            from asgiref.sync import async_to_sync
            from channels.layers import get_channel_layer
            channel_layer = get_channel_layer()
            payload = SupportMessageSerializer(sm).data
            async_to_sync(channel_layer.group_send)(f'support_conv_{conv.id}', {'type': 'support_message', 'message': payload})
        except Exception:
            logger.exception('Failed to broadcast admin support message')

        return Response({'status': 'ok'})

    # Otherwise this is a message from a Telegram user -> store as user message, forward to admin, and auto-ack
    sender_display = message.get('from', {}).get('username') or message.get('from', {}).get('first_name') or f"tg_{message.get('from', {}).get('id')}"
    sm = SupportMessage.objects.create(conversation=conv, sender='user', content=text, telegram_message_id=msg_id)
    conv.last_message_time = sm.created_at
    conv.telegram_chat_id = chat.get('id') if chat else conv.telegram_chat_id
    conv.save()

    # Broadcast user message to websocket listeners
    try:
        from asgiref.sync import async_to_sync
        from channels.layers import get_channel_layer
        channel_layer = get_channel_layer()
        payload = SupportMessageSerializer(sm).data
        async_to_sync(channel_layer.group_send)(f'support_conv_{conv.id}', {'type': 'support_message', 'message': payload})
    except Exception:
        logger.exception('Failed to broadcast user support message')

    # Forward to admin chat so admins see the incoming Telegram message
    res = ts.send_to_admin(conv, sender_display, text)
    if res.get('ok'):
        conv.telegram_message_id = res.get('message_id')
        conv.save()

    # Send an auto-reply/acknowledgement to the user
    ack_text = "Thanks for contacting Prime SMS Hub. We've received your message and will respond shortly."
    ack_res = ts.send_message_to_chat(chat.get('id'), ack_text) if chat else {'ok': False}
    if ack_res.get('ok'):
        try:
            ack_sm = SupportMessage.objects.create(conversation=conv, sender='admin', content=ack_text, telegram_message_id=ack_res.get('message_id'))
            conv.last_message_time = ack_sm.created_at
            conv.save()
            payload = SupportMessageSerializer(ack_sm).data
            async_to_sync(get_channel_layer().group_send)(f'support_conv_{conv.id}', {'type': 'support_message', 'message': payload})
        except Exception:
            logger.exception('Failed to record or broadcast ack message')

    return Response({'status': 'ok'})


@api_view(['GET'])
def admin_stats(request):
    """Return admin dashboard statistics. Access is allowed for staff users or via admin secret header."""
    # Allow access if user is authenticated staff or valid admin secret header is provided
    header_secret = request.headers.get('X-Admin-Secret') or request.META.get('HTTP_X_ADMIN_SECRET')
    configured_secret = getattr(settings, 'ADMIN_DASHBOARD_SECRET', 'dev-secret')
    if not (request.user.is_authenticated and request.user.is_staff) and header_secret != configured_secret:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)
    year_ago = now - timedelta(days=365)

    total_users = User.objects.count()
    active_users_30d = User.objects.filter(last_login__gte=thirty_days_ago).count()

    total_orders = Transaction.objects.filter(transaction_type='purchase').count()
    total_purchase_amount = Transaction.objects.filter(transaction_type='purchase', status='completed').aggregate(total=Sum('amount'))['total'] or 0

    pending_deposits = Transaction.objects.filter(transaction_type='fund', status='pending').count()
    failed_transactions = Transaction.objects.filter(status='failed').count()

    total_revenue = Transaction.objects.filter(status='completed').aggregate(total=Sum('amount'))['total'] or 0
    monthly_revenue = Transaction.objects.filter(status='completed', created_at__gte=thirty_days_ago).aggregate(total=Sum('amount'))['total'] or 0
    yearly_revenue = Transaction.objects.filter(status='completed', created_at__gte=year_ago).aggregate(total=Sum('amount'))['total'] or 0

    numbers_purchased = PhoneNumber.objects.count()

    # Top users by total spent
    top_users_qs = User.objects.annotate(total_spent=Sum('transactions__amount', filter=Q(transactions__status='completed'))).order_by('-total_spent')[:5]
    top_users = []
    for u in top_users_qs:
        top_users.append({'id': u.id, 'email': u.email, 'total_spent': u.total_spent or 0})

    # Pending payments list
    pending_payments_qs = Transaction.objects.filter(transaction_type='fund', status='pending').order_by('-created_at')[:10]
    pending_payments = []
    for p in pending_payments_qs:
        pending_payments.append({
            'id': p.id,
            'user_email': p.user.email if p.user else None,
            'reference': p.reference,
            'amount': p.amount,
            'description': p.description,
            'created_at': p.created_at
        })

    # Build a simple month labels and revenue for last 6 months
    months = []
    monthly_data = []
    for i in range(5, -1, -1):
        start = (now - timedelta(days=30 * i)).replace(day=1)
        end = (start + timedelta(days=32)).replace(day=1)
        label = start.strftime('%b')
        months.append(label)
        amount = Transaction.objects.filter(status='completed', created_at__gte=start, created_at__lt=end).aggregate(total=Sum('amount'))['total'] or 0
        monthly_data.append(amount)

    return Response({
        'total_users': total_users,
        'active_users_30d': active_users_30d,
        'total_orders': total_orders,
        'numbers_purchased': numbers_purchased,
        'total_purchase_amount': total_purchase_amount,
        'pending_deposits': pending_deposits,
        'failed_transactions': failed_transactions,
        'total_revenue': total_revenue,
        'monthly_revenue': monthly_revenue,
        'yearly_revenue': yearly_revenue,
        'top_users': top_users,
        'pending_payments': pending_payments,
        'months': months,
        'monthly_data': monthly_data
    })


@api_view(['GET'])
def admin_system_status(request):
    """Return system health status (API, Database, 5SIM, Paystack) - Admin only"""
    header_secret = request.headers.get('X-Admin-Secret') or request.META.get('HTTP_X_ADMIN_SECRET')
    configured_secret = getattr(settings, 'ADMIN_DASHBOARD_SECRET', 'dev-secret')
    if not (request.user.is_authenticated and request.user.is_staff) and header_secret != configured_secret:
        return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
    
    status_data = {
        'api': {'status': 'operational', 'message': 'API is running'},
        'database': {'status': 'healthy', 'message': 'Database connection OK'},
        'fivesim': {'status': 'unknown', 'message': 'Not checked'},
        'paystack': {'status': 'unknown', 'message': 'Not checked'}
    }
    
    # Check Database
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        status_data['database'] = {'status': 'healthy', 'message': 'Database connection OK'}
    except Exception as e:
        status_data['database'] = {'status': 'error', 'message': f'Database error: {str(e)}'}
    
    # Check 5SIM API
    try:
        fivesim_service = FiveSimService()
        result = fivesim_service.get_prices()
        if result and not result.get('status') is False:
            status_data['fivesim'] = {'status': 'connected', 'message': '5SIM API is accessible'}
        else:
            status_data['fivesim'] = {'status': 'error', 'message': result.get('message', '5SIM API error')}
    except Exception as e:
        status_data['fivesim'] = {'status': 'error', 'message': f'5SIM check failed: {str(e)}'}
    
    # Check Paystack API
    try:
        paystack_service = PaystackService()
        # Simple check - try to verify a dummy reference (will fail but confirms API is reachable)
        # Better: check if secret key is configured
        if paystack_service.secret_key and len(paystack_service.secret_key) > 10:
            status_data['paystack'] = {'status': 'configured', 'message': 'Paystack API key configured'}
        else:
            status_data['paystack'] = {'status': 'error', 'message': 'Paystack API key not configured'}
    except Exception as e:
        status_data['paystack'] = {'status': 'error', 'message': f'Paystack check failed: {str(e)}'}
    
    return Response(status_data)


@api_view(['POST'])
def paystack_webhook(request):
    """Handle Paystack webhooks to update transactions and wallets"""
    signature = request.headers.get('X-Paystack-Signature') or request.META.get('HTTP_X_PAYSTACK_SIGNATURE')
    secret = getattr(settings, 'PAYSTACK_SECRET_KEY', None)

    if not secret:
        return Response({'error': 'Paystack secret not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Verify signature
    body = request.body
    computed = hmac.new(secret.encode('utf-8'), body, hashlib.sha512).hexdigest()
    if not signature or not hmac.compare_digest(computed, signature):
        return Response({'error': 'Invalid signature'}, status=status.HTTP_403_FORBIDDEN)

    payload = json.loads(body.decode('utf-8'))
    event = payload.get('event')
    data = payload.get('data', {})

    # Handle charge.success
    if event == 'charge.success' or (data.get('status') == 'success' and data.get('authorization')):
        reference = data.get('reference')
        amount = (data.get('amount') or 0) / 100.0  # Paystack uses kobo

        try:
            tx = Transaction.objects.get(reference=reference)
        except Transaction.DoesNotExist:
            # No matching transaction; ignore for now
            return Response({'message': 'Transaction not found'}, status=status.HTTP_200_OK)

        if tx.status != 'completed':
            tx.status = 'completed'
            tx.save()
            # Update wallet
            if tx.transaction_type == 'fund':
                wallet, _ = Wallet.objects.get_or_create(user=tx.user)
                wallet.balance += tx.amount
                wallet.save()
                # send email
                email_service = EmailService()
                try:
                    email_service.send_transaction_confirmation(tx.user.email, tx)
                except Exception:
                    logger.exception('Failed to send transaction confirmation email')

        return Response({'message': 'Webhook processed'}, status=status.HTTP_200_OK)

    return Response({'message': 'Event ignored'}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        # Only staff can create Notifications via API
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        user_id = request.data.get('user')
        send_to_all = request.data.get('send_to_all', False)
        title = request.data.get('title')
        message = request.data.get('message')
        link = request.data.get('link', '')
        ntype = request.data.get('type', 'info')

        if send_to_all:
            # Create a notification record for all users
            users = User.objects.all()
            created = []
            for u in users:
                n = Notification.objects.create(user=u, title=title, message=message, link=link, type=ntype)
                created.append(n)
            return Response({'created': len(created)})

        if user_id:
            try:
                u = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_400_BAD_REQUEST)
            n = Notification.objects.create(user=u, title=title, message=message, link=link, type=ntype)
            return Response(NotificationSerializer(n).data, status=status.HTTP_201_CREATED)

        return Response({'error': 'Must provide user or send_to_all flag'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = Notification.objects.filter(Q(user=request.user) | Q(user__isnull=True), is_read=False).count()
        return Response({'unread': count})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(Q(user=request.user) | Q(user__isnull=True), is_read=False).update(is_read=True)
        return Response({'marked': True})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        n = get_object_or_404(Notification, pk=pk)
        if n.user and n.user != request.user:
            return Response({'error': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        n.is_read = True
        n.save()
        return Response(NotificationSerializer(n).data)

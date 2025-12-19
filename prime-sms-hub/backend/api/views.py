from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
import logging
from django.db.models import Q

from .models import Transaction, PhoneNumber, Wallet, SMSMessage
from .serializers import (
    UserSerializer, TransactionSerializer, PhoneNumberSerializer,
    WalletSerializer, SMSMessageSerializer
)
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import NotificationSerializer
from .models import Notification
from .services import PaystackService, FiveSimService, EmailService, FirebaseService

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


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
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
        
        # Check wallet balance
        wallet, _ = Wallet.objects.get_or_create(user=user)
        if wallet.balance < amount:
            return Response({'error': 'Insufficient wallet balance'}, status=status.HTTP_400_BAD_REQUEST)
        
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

        # Optional filtering by country code (e.g., US, CA)
        country = request.query_params.get('country')
        if country:
            # If the service returned a list, filter directly
            if isinstance(result, list):
                filtered = [item for item in result if (item.get('country') == country or item.get('iso') == country or item.get('code') == country)]
                return Response(filtered)

            # If a dict was returned, try to find list values and filter
            if isinstance(result, dict):
                # Collect any list-like entries
                lists = [v for v in result.values() if isinstance(v, list)]
                aggregated = []
                for lst in lists:
                    for item in lst:
                        if (isinstance(item, dict) and (item.get('country') == country or item.get('iso') == country or item.get('code') == country)):
                            aggregated.append(item)
                if aggregated:
                    return Response(aggregated)

        return Response(result)


class WalletViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        """Get wallet balance"""
        wallet, created = Wallet.objects.get_or_create(user=request.user)
        serializer = WalletSerializer(wallet)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_funds(self, request):
        """Add funds to wallet (via payment)"""
        amount = float(request.data.get('amount', 0))
        paystack_service = PaystackService()
        result = paystack_service.initialize_transaction(
            email=request.user.email,
            amount=amount,
            metadata={'user_id': request.user.id, 'type': 'fund'}
        )
        
        if result.get('status'):
            Transaction.objects.create(
                user=request.user,
                transaction_type='fund',
                amount=amount,
                status='pending',
                reference=result['data']['reference'],
                description='Wallet funding'
            )
            return Response({
                'payment_url': result['data']['authorization_url'],
                'reference': result['data']['reference']
            })
        
        return Response({'error': result.get('message')}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def upload_proof(self, request):
        """Upload proof of manual bank transfer and create pending transaction for verification"""
        amount = float(request.data.get('amount', 0))
        proof_file = request.FILES.get('proof')

        # Basic validation
        if amount <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
        if not proof_file:
            return Response({'error': 'Proof file is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a reference
        import uuid
        reference = f'PROOF-{uuid.uuid4().hex[:10].upper()}'

        tx = Transaction.objects.create(
            user=request.user,
            transaction_type='fund',
            amount=amount,
            status='pending',
            reference=reference,
            description='Manual bank transfer - proof uploaded',
            proof=proof_file,
            verification_status='pending'
        )

        return Response({'message': 'Proof uploaded; awaiting verification', 'transaction': TransactionSerializer(tx).data})


class NotificationViewSet(viewsets.ModelViewSet):
    """Manage user notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Notification.objects.all().order_by('-created_at')
        # Only show notifications relevant to the user or broadcasts
        return qs.filter(Q(user=self.request.user) | Q(user__isnull=True))

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

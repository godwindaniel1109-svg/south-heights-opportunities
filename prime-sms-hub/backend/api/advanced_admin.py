#!/usr/bin/env python
"""
Comprehensive admin interface customization for Prime SMS Hub
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.db.models import Sum, Count
from .models import Transaction, PhoneNumber, SMSMessage, Wallet, User, Profile
from .models import Notification

# Customize admin site
admin.site.site_header = "Prime SMS Hub - Admin Dashboard"
admin.site.site_title = "Prime SMS Hub"
admin.site.index_title = "Welcome to Prime SMS Hub Administration"


class WalletInline(admin.StackedInline):
    """Inline wallet display in user admin"""
    model = Wallet
    fields = ['balance', 'currency']
    extra = 0


class ProfileInline(admin.StackedInline):
    model = Profile
    fields = ['avatar', 'bio']
    readonly_fields = []
    extra = 0
    can_delete = False
    max_num = 1


try:
    admin.site.unregister(User)
except Exception:
    pass

for model in (Transaction, PhoneNumber, SMSMessage, Wallet, Profile):
    try:
        admin.site.unregister(model)
    except Exception:
        pass

@admin.register(User)
class CustomUserAdmin(DjangoUserAdmin):
    """Custom User admin"""
    list_display = ('username', 'email', 'full_name', 'profile_avatar_tag', 'wallet_balance', 'total_transactions', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    inlines = [WalletInline, ProfileInline]
    actions = ['ban_users', 'activate_users']

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

    def profile_avatar_tag(self, obj):
        try:
            avatar_url = obj.profile.avatar.url
            return format_html('<img src="{}" style="height:36px;border-radius:6px;object-fit:cover;" />', avatar_url)
        except Exception:
            return 'No avatar'
    profile_avatar_tag.short_description = 'Avatar'
    
    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = 'Full Name'
    
    def wallet_balance(self, obj):
        try:
            wallet = obj.wallet
            color = 'green' if wallet.balance > 0 else 'red'
            currency_map = {
                'NGN': '₦',
                'USD': '$',
                'EUR': '€'
            }
            symbol = currency_map.get(wallet.currency, wallet.currency)
            return format_html(
                '<span style="color: {};">{}{:.2f}</span>',
                color,
                symbol,
                wallet.balance
            )
        except:
            return 'No wallet'
    wallet_balance.short_description = 'Wallet Balance'
    
    def total_transactions(self, obj):
        count = obj.transactions.count()
        return format_html(
            '<span style="background-color: #417690; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            count
        )
    total_transactions.short_description = 'Transactions'

    def ban_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"Banned {updated} user(s).")
    ban_users.short_description = 'Ban selected users (deactivate)'

    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"Activated {updated} user(s).")
    activate_users.short_description = 'Activate selected users'


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    """Transaction admin"""
    list_display = ('reference', 'user', 'transaction_type_badge', 'amount', 'status_badge', 'credited', 'created_at')
    list_filter = ('transaction_type', 'status', 'credited', 'created_at')
    search_fields = ('user__username', 'reference', 'description')
    readonly_fields = ('reference', 'created_at', 'updated_at', 'user')
    date_hierarchy = 'created_at'
    actions = ['mark_transactions_completed', 'approve_transactions', 'reject_transactions']
    
    fieldsets = (
        ('Transaction Info', {
            'fields': ('user', 'reference', 'transaction_type', 'amount')
        }),
        ('Status', {
            'fields': ('status', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def transaction_type_badge(self, obj):
        colors = {
            'purchase': 'blue',
            'fund': 'green',
            'refund': 'orange'
        }
        color = colors.get(obj.transaction_type, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_transaction_type_display()
        )
    transaction_type_badge.short_description = 'Type'
    
    def status_badge(self, obj):
        colors = {
            'completed': 'green',
            'pending': 'orange',
            'failed': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def mark_transactions_completed(self, request, queryset):
        # Mark selected transactions as completed and apply wallet credit if fund
        updated = 0
        for tx in queryset:
            if tx.status != 'completed':
                tx.status = 'completed'
                tx.save()
                updated += 1
        self.message_user(request, f"Marked {updated} transaction(s) as completed.")
    mark_transactions_completed.short_description = 'Mark selected transactions as completed and apply wallet credit'

    def approve_transactions(self, request, queryset):
        # Approve selected transactions (verification approved)
        updated = 0
        for tx in queryset:
            if tx.verification_status != 'approved':
                tx.verification_status = 'approved'
                tx.status = 'completed'
                tx.save()
                updated += 1
        self.message_user(request, f"Approved {updated} transaction(s).")
    approve_transactions.short_description = 'Approve selected transactions (mark as verified and completed)'

    def reject_transactions(self, request, queryset):
        # Reject selected transactions (verification failed)
        updated = 0
        for tx in queryset:
            if tx.verification_status != 'rejected':
                tx.verification_status = 'rejected'
                tx.status = 'failed'
                tx.save()
                updated += 1
        self.message_user(request, f"Rejected {updated} transaction(s).")
    reject_transactions.short_description = 'Reject selected transactions (mark as failed)'


class SMSMessageInline(admin.TabularInline):
    """Inline SMS messages in phone number admin"""
    model = SMSMessage
    extra = 0
    readonly_fields = ('sender', 'content', 'received_at')
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(PhoneNumber)
class PhoneNumberAdmin(admin.ModelAdmin):
    """Phone Number admin"""
    list_display = ('phone_number', 'user', 'country', 'service', 'status_badge', 'price', 'expires_at', 'message_count')
    list_filter = ('country', 'service', 'status', 'created_at')
    search_fields = ('user__username', 'phone_number', 'country')
    readonly_fields = ('activation_id', 'created_at', 'phone_number', 'price')
    inlines = [SMSMessageInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Number Info', {
            'fields': ('user', 'phone_number', 'country', 'service')
        }),
        ('Details', {
            'fields': ('status', 'price', 'expires_at', 'activation_id')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'active': 'green',
            'inactive': 'orange',
            'expired': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 8px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'
    
    def message_count(self, obj):
        count = obj.messages.count()
        return format_html(
            '<span style="background-color: #417690; color: white; padding: 3px 8px; border-radius: 3px;">{} SMS</span>',
            count
        )
    message_count.short_description = 'Messages'


@admin.register(SMSMessage)
class SMSMessageAdmin(admin.ModelAdmin):
    """SMS Message admin"""
    list_display = ('phone_number', 'sender', 'content_preview', 'received_at')
    list_filter = ('phone_number', 'received_at')
    search_fields = ('phone_number__phone_number', 'sender', 'content')
    readonly_fields = ('phone_number', 'sender', 'content', 'received_at')
    date_hierarchy = 'received_at'
    
    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """Wallet admin"""
    list_display = ('user', 'balance_display', 'currency', 'created_at', 'transaction_sum')
    list_filter = ('currency', 'created_at')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('created_at', 'updated_at', 'user')
    
    def balance_display(self, obj):
        color = 'green' if obj.balance > 0 else 'red'
        return format_html(
            '<span style="color: {}; font-weight: bold;">${:.2f}</span>',
            color,
            obj.balance
        )
    balance_display.short_description = 'Balance'
    
    def transaction_sum(self, obj):
        total = obj.user.transactions.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        return f"${total:.2f}"
    transaction_sum.short_description = 'Total Transactions'


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'avatar_tag', 'notify_sound')
    search_fields = ('user__username', 'user__email')
    list_editable = ('notify_sound',)
    def avatar_tag(self, obj):
        try:
            return format_html('<img src="{}" style="height:36px;border-radius:6px;object-fit:cover;" />', obj.avatar.url)
        except Exception:
            return 'No avatar'
    avatar_tag.short_description = 'Avatar'


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'user_display', 'type', 'is_read', 'created_at')

    def user_display(self, obj):
        return obj.user.username if obj.user else 'ALL'
    user_display.short_description = 'User'
    list_filter = ('type', 'is_read', 'created_at')
    search_fields = ('title', 'message', 'user__username')
    readonly_fields = ('created_at',)

    def get_form(self, request, obj=None, **kwargs):
        # Add a transient field 'send_to_all' to allow creating notifications for all users
        form = super().get_form(request, obj, **kwargs)
        from django import forms
        form.base_fields['send_to_all'] = forms.BooleanField(required=False, initial=False, label='Send to all users')
        return form

    def save_model(self, request, obj, form, change):
        send_all = form.cleaned_data.get('send_to_all')
        if send_all:
            # create per-user notifications
            users = User.objects.all()
            created = 0
            for u in users:
                Notification.objects.create(user=u, title=obj.title, message=obj.message, link=obj.link, type=obj.type)
                created += 1
            self.message_user(request, f"Sent notification to {created} users.")
        else:
            super().save_model(request, obj, form, change)

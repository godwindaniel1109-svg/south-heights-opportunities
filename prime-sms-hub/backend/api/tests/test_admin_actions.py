import sys
import types
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse

# Provide fake sendgrid if not installed
if 'sendgrid' not in sys.modules:
    fake_sendgrid = types.ModuleType('sendgrid')
    fake_sendgrid.SendGridAPIClient = lambda *args, **kwargs: None
    helpers = types.ModuleType('helpers')
    mail = types.ModuleType('mail')
    mail.Mail = lambda *args, **kwargs: None
    helpers.mail = mail
    fake_sendgrid.helpers = helpers
    sys.modules['sendgrid'] = fake_sendgrid
    sys.modules['sendgrid.helpers'] = helpers
    sys.modules['sendgrid.helpers.mail'] = mail

from api.models import Wallet, Transaction


class AdminActionTests(TestCase):
    def setUp(self):
        # Admin user
        self.admin_user = User.objects.create(username='admin_action', is_staff=True, is_superuser=True)
        self.admin_user.set_password('adminpass')
        self.admin_user.save()

        # End user
        self.user = User.objects.create(username='action_user')
        self.user.set_password('userpass')
        self.user.save()

        Wallet.objects.get_or_create(user=self.user)

        self.client = Client()

    def test_mark_transactions_completed_admin_action(self):
        # Create pending fund transaction
        tx = Transaction.objects.create(user=self.user, transaction_type='fund', amount=25.00, status='pending', reference='action-123')
        w_before = self.user.wallet.balance

        # Admin login
        assert self.client.login(username='admin_action', password='adminpass')

        url = reverse('admin:api_transaction_changelist')
        resp = self.client.post(url, {'action': 'mark_transactions_completed', '_selected_action': [str(tx.pk)]}, follow=True)
        self.assertEqual(resp.status_code, 200)

        tx.refresh_from_db()
        self.user.refresh_from_db()
        self.assertEqual(tx.status, 'completed')
        self.assertTrue(tx.credited)
        self.assertEqual(float(self.user.wallet.balance), float(w_before + tx.amount))

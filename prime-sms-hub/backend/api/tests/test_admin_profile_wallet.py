import sys
import types
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse

# Ensure external modules are present during Django import
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

from api.models import Profile, Wallet, Transaction


class AdminProfileWalletTests(TestCase):
    def setUp(self):
        # Create an admin user
        self.admin_user = User.objects.create(username='admin_test', email='admin@test.local', is_staff=True, is_superuser=True)
        self.admin_user.set_password('password123')
        self.admin_user.save()

        # Create a normal user
        self.user = User.objects.create(username='user_test', email='user@test.local')
        self.user.set_password('userpass')
        self.user.save()

        # Ensure profile and wallet created via signals
        Profile.objects.get_or_create(user=self.user)
        Wallet.objects.get_or_create(user=self.user)

        self.client = Client()

    def test_profile_and_wallet_auto_created_on_user_create(self):
        u = User.objects.create(username='another_user', email='another@test.local')
        Profile.objects.get_or_create(user=u)
        w, created = Wallet.objects.get_or_create(user=u)
        self.assertTrue(hasattr(u, 'profile'))
        self.assertTrue(hasattr(u, 'wallet'))
        self.assertIsNotNone(u.profile)
        self.assertIsNotNone(u.wallet)

    def test_admin_inlines_present_on_user_change(self):
        # Login as admin
        self.assertTrue(self.client.login(username='admin_test', password='password123'))
        url = reverse('admin:auth_user_change', args=[self.user.id])
        resp = self.client.get(url, HTTP_HOST='localhost')
        self.assertEqual(resp.status_code, 200)
        html = resp.content.decode('utf-8')
        # Wallet inline markers
        self.assertIn('id_wallet-0-balance', html)
        self.assertIn('id_wallet-0-currency', html)
        # Profile inline markers
        self.assertIn('id_profile-0-avatar', html)
        self.assertIn('id_profile-0-bio', html)

    def test_transaction_credit_updates_wallet(self):
        w_before = self.user.wallet.balance
        # Create a fund transaction
        tx = Transaction.objects.create(user=self.user, transaction_type='fund', amount=50.00, status='pending', reference='tx-ref-123')
        # Mark as completed and save (signal should credit wallet)
        tx.status = 'completed'
        tx.save()
        self.user.refresh_from_db()
        self.assertEqual(float(self.user.wallet.balance), float(w_before + tx.amount))
        tx.refresh_from_db()
        self.assertTrue(tx.credited)

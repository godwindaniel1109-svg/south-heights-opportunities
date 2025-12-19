from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile

from ..models import Wallet, Transaction


class WalletProofUploadTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('alice', 'alice@example.com', 'password123')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_upload_proof_creates_pending_transaction(self):
        f = SimpleUploadedFile('proof.jpg', b'filedata', content_type='image/jpeg')
        resp = self.client.post('/api/wallet/upload_proof/', {'amount': '1500', 'proof': f, 'reference': 'BANKREF123'})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('transaction', data)
        tx = Transaction.objects.get(id=data['transaction']['id'])
        self.assertEqual(tx.verification_status, 'pending')
        self.assertEqual(tx.status, 'pending')

    def test_approving_transaction_credits_wallet(self):
        # upload proof
        f = SimpleUploadedFile('proof.pdf', b'pdfdata', content_type='application/pdf')
        resp = self.client.post('/api/wallet/upload_proof/', {'amount': '2500', 'proof': f, 'reference': 'BANKREF2'})
        tx_id = resp.json()['transaction']['id']
        tx = Transaction.objects.get(id=tx_id)

        # Wallet should start at zero
        w = Wallet.objects.get(user=self.user)
        self.assertEqual(float(w.balance), 0.0)

        # Approve (simulate admin action)
        tx.verification_status = 'approved'
        tx.status = 'completed'
        tx.save()

        # Wallet should be credited by signal
        w.refresh_from_db()
        self.assertEqual(float(w.balance), float(tx.amount))

    def test_list_transactions_includes_pending_proof(self):
        # upload proof
        f = SimpleUploadedFile('proof.jpg', b'filedata', content_type='image/jpeg')
        resp = self.client.post('/api/wallet/upload_proof/', {'amount': '1800', 'proof': f, 'reference': 'BANKREF3'})
        self.assertEqual(resp.status_code, 200)

        # list transactions
        list_resp = self.client.get('/api/transactions/')
        self.assertEqual(list_resp.status_code, 200)
        data = list_resp.json()

        # handle pagination or direct list
        items = data.get('results') if isinstance(data, dict) and 'results' in data else data
        self.assertTrue(any(tx.get('reference') == resp.json()['transaction']['reference'] and tx.get('verification_status') == 'pending' for tx in items))

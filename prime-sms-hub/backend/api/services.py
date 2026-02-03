from django.conf import settings
import requests
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)


class PaystackService:
    """Service for Paystack payment integration"""
    
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.base_url = 'https://api.paystack.co'
        self.headers = {
            'Authorization': f'Bearer {self.secret_key}'
        }
    
    def initialize_transaction(self, email, amount, metadata=None):
        """Initialize a transaction"""
        try:
            url = f'{self.base_url}/transaction/initialize'
            data = {
                'email': email,
                'amount': int(amount * 100),  # Convert to kobo
                'metadata': metadata or {}
            }
            response = requests.post(url, json=data, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Paystack error: {str(e)}")
            return {'status': False, 'message': str(e)}
    
    def verify_transaction(self, reference):
        """Verify a transaction"""
        try:
            url = f'{self.base_url}/transaction/verify/{reference}'
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Paystack verification error: {str(e)}")
            return {'status': False, 'message': str(e)}


class FiveSimService:
    """Service for 5SIM phone number API integration"""
    
    def __init__(self):
        self.api_key = settings.FIVESIM_API_KEY
        self.base_url = settings.FIVESIM_API_URL
        self.headers = {
            'Authorization': f'Bearer {self.api_key}'
        }
    
    def get_prices(self):
        """Get available phone numbers and prices"""
        try:
            url = f'{self.base_url}/pricing'
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"5SIM API error: {str(e)}")
            return {'status': False, 'message': str(e)}
    
    def buy_number(self, country, service):
        """Buy a phone number"""
        try:
            url = f'{self.base_url}/user/buy/activation'
            params = {
                'country': country,
                'product': service
            }
            response = requests.get(url, params=params, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"5SIM purchase error: {str(e)}")
            return {'status': False, 'message': str(e)}
    
    def get_status(self, activation_id):
        """Get SMS activation status"""
        try:
            url = f'{self.base_url}/user/activation/{activation_id}'
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"5SIM status error: {str(e)}")
            return {'status': False, 'message': str(e)}


class EmailService:
    """Service for SendGrid email integration"""
    
    def __init__(self):
        self.api_key = settings.SENDGRID_API_KEY
        self.from_email = settings.SENDGRID_FROM_EMAIL
    
    def send_email(self, to_email, subject, html_content):
        """Send email using SendGrid"""
        try:
            message = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            sg = SendGridAPIClient(self.api_key)
            response = sg.send(message)
            logger.info(f"Email sent to {to_email}: {response.status_code}")
            return {'status': True, 'message': 'Email sent successfully'}
        except Exception as e:
            logger.error(f"SendGrid error: {str(e)}")
            return {'status': False, 'message': str(e)}
    
    def send_transaction_confirmation(self, to_email, transaction):
        """Send transaction confirmation email"""
        html_content = f"""
        <h2>Transaction Confirmation</h2>
        <p>Your transaction has been completed successfully.</p>
        <ul>
            <li>Type: {transaction.get_transaction_type_display()}</li>
            <li>Amount: ${transaction.amount}</li>
            <li>Reference: {transaction.reference}</li>
            <li>Date: {transaction.created_at}</li>
        </ul>
        """
        return self.send_email(to_email, 'Transaction Confirmation', html_content)


class FirebaseService:
    """Service for Firebase integration"""
    
    def __init__(self):
        self.config = settings.FIREBASE_CONFIG
    
    def get_config(self):
        """Get Firebase config for frontend"""
        return self.config


class TelegramService:
    """Service for sending/receiving messages via Telegram Bot API"""

    def __init__(self):
        self.token = getattr(settings, 'TELEGRAM_BOT_TOKEN', None)
        self.admin_chat = getattr(settings, 'TELEGRAM_ADMIN_CHAT_ID', None)
        self.base = 'https://api.telegram.org'

    def send_to_admin(self, conversation, user_display, message_text):
        """Send a formatted message to the admin chat and return message_id and chat_id"""
        if not self.token or not self.admin_chat:
            return {'ok': False, 'message': 'Telegram not configured'}

        url = f"{self.base}/bot{self.token}/sendMessage"
        payload = {
            'chat_id': int(self.admin_chat),
            'text': f"🟢 Ticket #{conversation.id}\n👤 User: {user_display}\n📍 Page: {conversation.page}\n\n{message_text}",
            'parse_mode': 'HTML'
        }
        try:
            r = requests.post(url, json=payload)
            r.raise_for_status()
            data = r.json()
            if data.get('ok'):
                msg = data['result']
                return {'ok': True, 'chat_id': msg['chat']['id'], 'message_id': msg['message_id'], 'data': msg}
            return {'ok': False, 'message': data}
        except Exception as e:
            logger.exception('Telegram send error')
            return {'ok': False, 'message': str(e)}

    def send_message_to_chat(self, chat_id, text, parse_mode='HTML'):
        """Send a message to a specific Telegram chat_id and return result dict."""
        if not self.token:
            return {'ok': False, 'message': 'Telegram token not configured'}
        url = f"{self.base}/bot{self.token}/sendMessage"
        payload = {'chat_id': int(chat_id), 'text': text, 'parse_mode': parse_mode}
        try:
            r = requests.post(url, json=payload, timeout=10)
            r.raise_for_status()
            data = r.json()
            if data.get('ok'):
                msg = data['result']
                return {'ok': True, 'chat_id': msg['chat']['id'], 'message_id': msg['message_id'], 'data': msg}
            return {'ok': False, 'message': data}
        except Exception as e:
            logger.exception('Telegram send error')
            return {'ok': False, 'message': str(e)}

    def reply_to_user(self, conversation, text):
        """Send message to the user's Telegram chat if known."""
        if not conversation or not conversation.telegram_chat_id:
            return {'ok': False, 'message': 'No telegram chat id for conversation'}
        return self.send_message_to_chat(conversation.telegram_chat_id, text)

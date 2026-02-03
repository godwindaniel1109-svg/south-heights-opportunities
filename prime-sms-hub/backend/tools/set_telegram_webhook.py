"""Helper to set Telegram webhook URL.
Usage: python set_telegram_webhook.py <BOT_TOKEN> <WEBHOOK_URL> [<SECRET_TOKEN>]
This will call the Telegram API to set the webhook for the provided bot token.
"""

import sys
import requests


def set_webhook(token, url, secret_token=None):
    base = f"https://api.telegram.org/bot{token}"
    params = {'url': url}
    if secret_token:
        params['secret_token'] = secret_token
    r = requests.get(f"{base}/setWebhook", params=params)
    r.raise_for_status()
    return r.json()


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Usage: python set_telegram_webhook.py <BOT_TOKEN> <WEBHOOK_URL> [<SECRET_TOKEN>]')
        sys.exit(1)
    token = sys.argv[1]
    url = sys.argv[2]
    secret = sys.argv[3] if len(sys.argv) > 3 else None
    print('Setting webhook...')
    resp = set_webhook(token, url, secret)
    print(resp)

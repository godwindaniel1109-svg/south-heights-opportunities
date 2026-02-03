#!/usr/bin/env python3
from pyngrok import ngrok
import time

print('Starting ngrok tunnel for port 8000...')
tunnel = ngrok.connect(8000)
print('PUBLIC_URL:', tunnel.public_url)
print('Press Ctrl-C to exit and stop tunnel')
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print('Stopping tunnel')
    ngrok.disconnect(tunnel.public_url)
    ngrok.kill()

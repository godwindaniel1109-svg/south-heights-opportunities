"""
Test API endpoints
Usage: python test_api.py
"""

import requests
import json

BASE_URL = 'http://localhost:8000/api'

def test_health():
    """Test health endpoint"""
    print("Testing health endpoint...")
    response = requests.get(f'{BASE_URL}/health/')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}\n")

def test_firebase_config():
    """Test Firebase config endpoint"""
    print("Testing Firebase config endpoint...")
    response = requests.get(f'{BASE_URL}/firebase-config/')
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_available_numbers():
    """Test available phone numbers"""
    print("Testing available phone numbers...")
    response = requests.get(f'{BASE_URL}/phone-numbers/available_numbers/')
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    else:
        print(f"Error: {response.text}\n")

def main():
    print("\n" + "="*60)
    print("Prime SMS Hub - API Tests")
    print("="*60 + "\n")
    
    try:
        test_health()
        test_firebase_config()
        test_available_numbers()
        print("✅ All tests completed!")
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server")
        print("   Make sure the server is running: python liveserver.py")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Mobile App Deployment Verification Script
Checks all A+B+C components are properly installed
"""

import os
import json
from pathlib import Path

def check_file(path, description):
    """Check if file exists and has content"""
    if os.path.exists(path):
        size = os.path.getsize(path)
        status = "✅" if size > 0 else "⚠️ "
        print(f"{status} {description}: {size:,} bytes")
        return True
    else:
        print(f"❌ {description}: NOT FOUND")
        return False

def check_content(filepath, search_strings):
    """Check if file contains expected content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        results = []
        for search_str in search_strings:
            found = search_str in content
            results.append(found)
        return all(results)
    except:
        return False

def verify_mobile_app():
    """Verify user mobile app"""
    print("\n" + "="*60)
    print("📱 VERIFYING USER MOBILE APP")
    print("="*60)
    
    checks = [
        ("mobile/index.html", "User App - Dashboard"),
        ("mobile/login.html", "User App - Login"),
        ("mobile/register.html", "User App - Register"),
        ("mobile/js/api.js", "API Client (190 lines)"),
        ("mobile/js/mock-data.js", "Mock Data (120 lines)"),
        ("mobile/js/mobile.js", "App Logic"),
        ("mobile/css/mobile.css", "Mobile Styles"),
        ("mobile/manifest.json", "PWA Manifest"),
        ("mobile/sw.js", "Service Worker"),
        ("mobile/vercel.json", "Vercel Config"),
        ("mobile/README.md", "Documentation"),
    ]
    
    results = []
    for path, desc in checks:
        results.append(check_file(path, desc))
    
    return all(results)

def verify_api_integration():
    """Verify B - API integration"""
    print("\n" + "="*60)
    print("🔌 VERIFYING B - API INTEGRATION")
    print("="*60)
    
    api_file = "mobile/js/api.js"
    
    methods = [
        "getWallet",
        "getPhoneNumbers",
        "buyPhoneNumber",
        "getTransactions",
        "adminLogin",
        "getUsers",
        "updateUser",
        "approveTransaction",
        "getSupportConversations",
        "replySupportMessage",
        "getAdminStats"
    ]
    
    all_found = True
    for method in methods:
        if check_content(api_file, [f"async {method}("]):
            print(f"✅ Method: {method}()")
        else:
            print(f"❌ Method: {method}() - NOT FOUND")
            all_found = False
    
    return all_found

def verify_mock_data():
    """Verify A - Mock data"""
    print("\n" + "="*60)
    print("💾 VERIFYING A - MOCK DATA FALLBACK")
    print("="*60)
    
    mock_file = "mobile/js/mock-data.js"
    
    data_keys = [
        "MOCK_DATA",
        "wallet",
        "numbers",
        "transactions",
        "support",
        "admin",
        "getMockData"
    ]
    
    all_found = True
    for key in data_keys:
        if check_content(mock_file, [key]):
            print(f"✅ Data: {key}")
        else:
            print(f"❌ Data: {key} - NOT FOUND")
            all_found = False
    
    return all_found

def verify_admin_app():
    """Verify C - Mobile admin app"""
    print("\n" + "="*60)
    print("👨‍💼 VERIFYING C - MOBILE ADMIN APP")
    print("="*60)
    
    checks = [
        ("mobile-admin/index.html", "Admin Dashboard"),
        ("mobile-admin/users.html", "User Management"),
        ("mobile-admin/payments.html", "Payment Approval"),
        ("mobile-admin/support.html", "Support Management"),
        ("mobile-admin/login.html", "Admin Login"),
        ("mobile-admin/js/admin.js", "Admin Logic (500 lines)"),
        ("mobile-admin/css/admin.css", "Admin Styles (600 lines)"),
        ("mobile-admin/manifest.json", "Admin PWA Manifest"),
        ("mobile-admin/vercel.json", "Admin Vercel Config"),
    ]
    
    results = []
    for path, desc in checks:
        results.append(check_file(path, desc))
    
    return all(results)

def verify_documentation():
    """Verify documentation"""
    print("\n" + "="*60)
    print("📚 VERIFYING DOCUMENTATION")
    print("="*60)
    
    checks = [
        ("mobile/README.md", "User App Docs"),
        ("mobile-admin/README.md", "Admin App Docs"),
        ("mobile-admin/TESTING.md", "Testing Guide (30+ tests)"),
        ("mobile-admin/IMPLEMENTATION.md", "Implementation Details"),
        ("MOBILE_QUICKSTART.md", "Quick Start Guide"),
        ("MOBILE_DEPLOYMENT_COMPLETE.md", "Deployment Summary"),
    ]
    
    results = []
    for path, desc in checks:
        results.append(check_file(path, desc))
    
    return all(results)

def verify_api_calls():
    """Verify API integration in mobile.js"""
    print("\n" + "="*60)
    print("🔄 VERIFYING API INTEGRATION IN MOBILE.JS")
    print("="*60)
    
    mobile_js = "mobile/js/mobile.js"
    
    integrations = [
        ("api.getWallet()", "Fetch wallet data"),
        ("api.getTransactions", "Fetch transactions"),
        ("getMockData", "Fallback to mock data"),
    ]
    
    all_found = True
    for call, desc in integrations:
        if check_content(mobile_js, [call]):
            print(f"✅ {desc}: {call}")
        else:
            print(f"❌ {desc}: {call} - NOT FOUND")
            all_found = False
    
    return all_found

def main():
    """Run all verification checks"""
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║  MOBILE APP A+B+C DEPLOYMENT VERIFICATION".center(58) + "║")
    print("║  Prime SMS Hub".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")
    
    results = {
        "User Mobile App": verify_mobile_app(),
        "A - Mock Data": verify_mock_data(),
        "B - API Integration": verify_api_integration(),
        "API Calls in Mobile.js": verify_api_calls(),
        "C - Admin App": verify_admin_app(),
        "Documentation": verify_documentation(),
    }
    
    print("\n" + "="*60)
    print("📋 SUMMARY")
    print("="*60)
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    for component, status in results.items():
        symbol = "✅" if status else "❌"
        print(f"{symbol} {component}")
    
    print("\n" + "-"*60)
    print(f"Total: {passed}/{total} components verified")
    
    if passed == total:
        print("\n🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} component(s) need attention")
        return 1

if __name__ == "__main__":
    exit(main())

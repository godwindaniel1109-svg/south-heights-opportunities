import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  UserIcon, 
  BellIcon, 
  ShieldIcon,
  CreditCardIcon,
  GlobeIcon,
  HelpCircleIcon,
  SaveIcon
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldIcon },
    { id: 'billing', label: 'Billing', icon: CreditCardIcon },
    { id: 'preferences', label: 'Preferences', icon: GlobeIcon },
    { id: 'help', label: 'Help', icon: HelpCircleIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="card p-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="card p-8">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Orderly Store"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+234 800 000 0000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="123 Business Street, Lagos, Nigeria"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Order Notifications</p>
                        <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Payment Reminders</p>
                        <p className="text-sm text-gray-500">Reminders for pending payments</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-primary-600 rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Daily Summary</p>
                        <p className="text-sm text-gray-500">Daily sales and performance summary</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Marketing Emails</p>
                        <p className="text-sm text-gray-500">Tips, updates, and promotional content</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-primary-600 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                    <button className="btn-secondary">Enable</button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="card p-6 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">Current Plan: Pro</p>
                        <p className="text-blue-700">₦3,000/month • Renews on March 1, 2024</p>
                      </div>
                      <button className="btn-primary">Change Plan</button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                    <div className="card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            VISA
                          </div>
                          <div>
                            <p className="font-medium">•••• 4242</p>
                            <p className="text-sm text-gray-500">Expires 12/25</p>
                          </div>
                        </div>
                        <button className="btn-secondary">Update</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preferences</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>English</option>
                        <option>Pidgin</option>
                        <option>Yoruba</option>
                        <option>Igbo</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>NGN (₦)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                        <option>West Africa Time (WAT)</option>
                        <option>Greenwich Mean Time (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Help & Support</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">Getting Started Guide</h3>
                      <p className="text-gray-600 text-sm">Learn how to set up your account and start selling</p>
                    </div>
                    
                    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                      <p className="text-gray-600 text-sm">Watch step-by-step video guides</p>
                    </div>
                    
                    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
                      <p className="text-gray-600 text-sm">Find answers to common questions</p>
                    </div>
                    
                    <div className="card p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                      <p className="text-gray-600 text-sm">Get help from our support team</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <button className="btn-primary">
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

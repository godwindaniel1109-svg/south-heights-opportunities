import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { 
  BellIcon, 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import type { Reminder } from '../types';

export default function Reminders() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const reminders: Reminder[] = [
    {
      id: '1',
      orderId: '002',
      customerId: '2',
      type: 'payment',
      message: 'Follow up with Mike Chen for pending payment of ₦12,000',
      scheduledDate: '2024-02-17T10:00:00Z',
      isCompleted: false,
      createdAt: '2024-02-16T09:15:00Z'
    },
    {
      id: '2',
      orderId: '004',
      customerId: '4',
      type: 'delivery',
      message: 'Deliver order to David Okafor - Lagos Island',
      scheduledDate: '2024-02-17T14:00:00Z',
      isCompleted: false,
      createdAt: '2024-02-15T11:30:00Z'
    },
    {
      id: '3',
      orderId: '001',
      customerId: '1',
      type: 'followup',
      message: 'Check if Sarah Johnson is satisfied with her purchase',
      scheduledDate: '2024-02-18T16:00:00Z',
      isCompleted: false,
      createdAt: '2024-02-15T10:30:00Z'
    }
  ];

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return AlertCircleIcon;
      case 'delivery':
        return CalendarIcon;
      case 'followup':
        return BellIcon;
      default:
        return BellIcon;
    }
  };

  const getReminderColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'bg-red-100 text-red-600';
      case 'delivery':
        return 'bg-blue-100 text-blue-600';
      case 'followup':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isAuthenticated={true} />
      
      <div className="container pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reminders</h1>
            <p className="text-gray-600 mt-1">Never miss important follow-ups</p>
          </div>
          
          <button className="btn-primary mt-4 sm:mt-0">
            <PlusIcon className="w-4 h-4 mr-2" />
            Set Reminder
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{reminders.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <BellIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <AlertCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="card p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'payment', 'delivery', 'followup'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders
            .filter(reminder => selectedFilter === 'all' || reminder.type === selectedFilter)
            .map((reminder) => {
              const IconComponent = getReminderIcon(reminder.type);
              
              return (
                <div key={reminder.id} className="card p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getReminderColor(reminder.type)}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {reminder.type.charAt(0).toUpperCase() + reminder.type.slice(1)} Reminder
                          </h3>
                          <p className="text-gray-700 mb-2">{reminder.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              {new Date(reminder.scheduledDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {new Date(reminder.scheduledDate).toLocaleTimeString()}
                            </span>
                            <span>Order #{reminder.orderId}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="btn-secondary">
                            <CheckCircleIcon className="w-4 h-4 mr-2" />
                            Complete
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <AlertCircleIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

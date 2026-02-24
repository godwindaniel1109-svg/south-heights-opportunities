'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  companyName: string
  userRole: string
}

export default function Sidebar({ companyName, userRole }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: '📊', 
      href: '/dashboard',
      roles: ['admin', 'manager', 'staff']
    },
    { 
      name: 'Sales', 
      icon: '💰', 
      href: '/sales',
      roles: ['admin', 'manager', 'staff']
    },
    { 
      name: 'Customers', 
      icon: '👥', 
      href: '/customers',
      roles: ['admin', 'manager', 'staff']
    },
    { 
      name: 'Finance', 
      icon: '📈', 
      href: '/finance',
      roles: ['admin', 'manager']
    },
    { 
      name: 'Team', 
      icon: '👔', 
      href: '/team',
      roles: ['admin', 'manager']
    },
    { 
      name: 'Tasks', 
      icon: '✅', 
      href: '/tasks',
      roles: ['admin', 'manager', 'staff']
    },
    { 
      name: 'Reports', 
      icon: '📋', 
      href: '/reports',
      roles: ['admin', 'manager']
    },
    { 
      name: 'Billing', 
      icon: '💳', 
      href: '/billing',
      roles: ['admin']
    },
    { 
      name: 'Settings', 
      icon: '⚙️', 
      href: '/settings',
      roles: ['admin']
    }
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    localStorage.removeItem('company')
    router.push('/login')
  }

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 min-h-screen transition-all duration-300 flex flex-col`}>
      {/* Logo and Company Name */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${collapsed ? 'hidden' : 'block'}`}>
            <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg">
              O
            </div>
            <div>
              <div className="font-semibold text-text">Operra</div>
              <div className="text-xs text-gray-500 truncate max-w-[140px]">
                {companyName}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-lg">{collapsed ? '→' : '←'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-text'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {!collapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Actions */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="mb-3">
            <div className="text-sm font-medium text-text capitalize">
              {userRole}
            </div>
            <div className="text-xs text-gray-500">
              Account Settings
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full`}
        >
          <span className="text-xl">🚪</span>
          {!collapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  )
}

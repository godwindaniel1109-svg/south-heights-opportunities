'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    phone: '',
    currency: 'NGN'
  })
  
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company: companyData,
          user: {
            email: userData.email,
            password: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone
          }
        })
      })

      const data = await response.json()

      if (data.success) {
        // Store tokens and user data
        localStorage.setItem('accessToken', data.data.tokens.accessToken)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        localStorage.setItem('company', JSON.stringify(data.data.company))
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.message || 'Registration failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Operra</h1>
            <p className="text-gray-600">Create your business workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    className="input-field"
                    placeholder="Your Business Ltd"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={companyData.email}
                    onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                    className="input-field"
                    placeholder="company@business.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    className="input-field"
                    placeholder="+2348012345678"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency *
                  </label>
                  <select
                    value={companyData.currency}
                    onChange={(e) => setCompanyData({...companyData, currency: e.target.value})}
                    className="input-field"
                  >
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="GHS">Ghana Cedi (₵)</option>
                    <option value="KES">Kenyan Shilling (KSh)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Admin User Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Admin Account</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userData.firstName}
                      onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      className="input-field"
                      placeholder="John"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={userData.lastName}
                      onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      className="input-field"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="input-field"
                    placeholder="admin@business.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                    className="input-field"
                    placeholder="+2348012345679"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={userData.password}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                    className="input-field"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Business Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

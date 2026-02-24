'use client'

import { useState, useEffect } from 'react'

interface TestResult {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
  data?: any
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Frontend Rendering', status: 'pending' },
    { name: 'API Connection', status: 'pending' },
    { name: 'Database Connection', status: 'pending' },
    { name: 'Database Schema', status: 'pending' },
    { name: 'Company Isolation', status: 'pending' },
    { name: 'JWT Functionality', status: 'pending' },
  ])

  const runTests = async () => {
    // Test 1: Frontend Rendering
    setTests(prev => prev.map(t => 
      t.name === 'Frontend Rendering' 
        ? { ...t, status: 'success', message: 'Next.js and Tailwind CSS working' }
        : t
    ))

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    // Test 2: API Connection
    try {
      setTests(prev => prev.map(t => 
        t.name === 'API Connection' ? { ...t, status: 'running' } : t
      ))
      
      const response = await fetch(`${API_URL}/health`)
      const data = await response.json()
      
      setTests(prev => prev.map(t => 
        t.name === 'API Connection' 
          ? { ...t, status: 'success', message: 'Backend server responding', data }
          : t
      ))
    } catch (error) {
      setTests(prev => prev.map(t => 
        t.name === 'API Connection' 
          ? { ...t, status: 'error', message: 'Cannot connect to backend' }
          : t
      ))
    }

    // Test 3-6: Backend Tests
    const backendTests = [
      { name: 'Database Connection', endpoint: '/test/db' },
      { name: 'Database Schema', endpoint: '/test/schema' },
      { name: 'Company Isolation', endpoint: '/test/isolation' },
      { name: 'JWT Functionality', endpoint: '/test/jwt' }
    ]

    for (const test of backendTests) {
      try {
        setTests(prev => prev.map(t => 
          t.name === test.name ? { ...t, status: 'running' } : t
        ))
        
        const response = await fetch(`${API_URL}${test.endpoint}`)
        const data = await response.json()
        
        setTests(prev => prev.map(t => 
          t.name === test.name 
            ? { 
                ...t, 
                status: data.success ? 'success' : 'error', 
                message: data.success ? 'Test passed' : data.message,
                data
              }
            : t
        ))
      } catch (error) {
        setTests(prev => prev.map(t => 
          t.name === test.name 
            ? { ...t, status: 'error', message: 'Request failed' }
            : t
        ))
      }
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'running': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'running': return '⏳'
      default: return '⭕'
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-text mb-2">Operra Foundation Tests</h1>
        <p className="text-gray-600 mb-8">Testing all core components before Phase 2 development</p>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Test Results</h2>
            <button 
              onClick={runTests}
              className="btn-primary"
            >
              Run Tests Again
            </button>
          </div>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(test.status)}</span>
                    <h3 className="font-semibold text-lg">{test.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                {test.message && (
                  <p className="text-gray-600 ml-11">{test.message}</p>
                )}
                {test.data && (
                  <details className="ml-11 mt-2">
                    <summary className="cursor-pointer text-sm text-primary hover:underline">
                      View Response Data
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-2 text-gray-600">
            <p>✅ If all tests pass: Foundation is ready for Phase 2</p>
            <p>⚠️ If some tests fail: Fix issues before proceeding</p>
            <p>📋 Common issues:</p>
            <ul className="ml-4 list-disc">
              <li>PostgreSQL not running or connection string wrong</li>
              <li>Backend server not started on port 3000</li>
              <li>Database schema not created</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

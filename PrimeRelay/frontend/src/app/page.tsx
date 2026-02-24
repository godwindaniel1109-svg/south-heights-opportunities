import Link from 'next/link';
import { MessageSquare, ArrowRight, CheckCircle, Shield, Zap, Users, XCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Reliable messaging</span>
                  <span className="block text-blue-600">infrastructure</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  PrimeRelay provides high-delivery SMS routing, virtual numbers, and real-time reporting through a fast and stable platform built for scale.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    >
                      Start Sending
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  No delays • Real delivery reports • 24/7 uptime monitoring
                </p>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full bg-blue-100 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
            <MessageSquare className="h-32 w-32 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Credibility Bar */}
      <div className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Supported Use Cases:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
              <span className="font-medium">Applications</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">Fintech</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">Marketing</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">Logistics</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">OTP Verification</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium">Notifications</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Designed for high-volume and mission-critical messaging</p>
          </div>
        </div>
      </div>

      {/* Problem Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Most SMS platforms fail when you need them most
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 mx-auto">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Unstable gateways</h3>
              <p className="mt-2 text-base text-gray-500">
                Messages stuck or delayed when you need them most
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 mx-auto">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No delivery transparency</h3>
              <p className="mt-2 text-base text-gray-500">
                You never know what actually delivered
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 mx-auto">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Poor support</h3>
              <p className="mt-2 text-base text-gray-500">
                No response when campaigns fail
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              PrimeRelay routes messages intelligently
            </h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mx-auto">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Smart Routing</h3>
              <p className="mt-2 text-base text-gray-500">
                Automatically selects the best route per destination
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Real Delivery Reports</h3>
              <p className="mt-2 text-base text-gray-500">
                Know exactly what delivered, failed, or pending
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mx-auto">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Scalable Queue System</h3>
              <p className="mt-2 text-base text-gray-500">
                Handles bulk traffic without slowing down
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 mx-auto">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Number Services</h3>
              <p className="mt-2 text-base text-gray-500">
                Purchase local and international virtual numbers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Send with confidence
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Create your account and start routing messages in minutes
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { ArrowRightIcon, CheckIcon } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight max-w-lg">
                Run your WhatsApp business like a real store
              </h1>
              <p className="text-xl text-gray-600 max-w-md">
                Orderly helps you track customers, record orders, and monitor payments in one organized dashboard — so nothing slips through the cracks again.
              </p>
              <p className="text-sm text-gray-500">
                Works on phone and laptop. No installation required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="btn-primary text-lg px-8">
                Start Free
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="btn-secondary text-lg px-8">
                View Demo
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Track every order in seconds</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Know exactly who has paid</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Follow up with the right customers</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">See your daily sales instantly</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="/images/dashboard-preview.png"
                alt="Orderly Dashboard Preview"
                className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-blue-50 rounded-2xl transform rotate-3 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

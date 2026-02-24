import { CheckIcon } from 'lucide-react';
import type { PricingPlan } from '../../types';

export default function Pricing() {
  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 1500,
      currency: '₦',
      interval: 'month',
      features: [
        'Customer list',
        'Order recording',
        'Basic tracking'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 3000,
      currency: '₦',
      interval: 'month',
      features: [
        'Everything in Starter',
        'Reminders',
        'Sales overview',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 6000,
      currency: '₦',
      interval: 'month',
      features: [
        'Everything in Pro',
        'Advanced reports',
        'Exports',
        'Multi-device usage'
      ]
    }
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as your business grows
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card p-8 relative ${
                plan.popular
                  ? 'border-2 border-primary-600 shadow-lg scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.currency}{plan.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/{plan.interval}</span>
                  </div>
                </div>

                <button className={`w-full btn-primary ${
                  plan.popular ? 'bg-primary-600' : 'bg-gray-900 hover:bg-gray-800'
                }`}>
                  Start Free Trial
                </button>
              </div>

              <div className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

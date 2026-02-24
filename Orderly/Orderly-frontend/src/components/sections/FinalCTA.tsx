import { ArrowRightIcon } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section-padding bg-primary-900 text-white">
      <div className="container">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Stop guessing your business performance
          </h2>
          <p className="text-xl text-primary-100">
            Start keeping proper records and never lose track of a customer again.
          </p>
          <button className="bg-white text-primary-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center text-lg">
            Create Free Account
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}

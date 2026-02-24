export default function ProductShowcase() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Your business, finally organized
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <img
              src="/images/full-dashboard.png"
              alt="Orderly Full Dashboard"
              className="w-full rounded-3xl shadow-2xl"
            />
            <p className="text-gray-600 mt-6 text-lg">
              Your entire business at a glance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

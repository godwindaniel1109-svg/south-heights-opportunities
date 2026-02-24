export default function Problem() {
  const problems = [
    "Searching chats to find past orders",
    "Forgetting unpaid customers",
    "No clear daily profit record",
    "Mixing personal and business conversations",
    "Losing repeat buyers"
  ];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Selling from chat shouldn't feel chaotic
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Messages come in all day. Orders get buried. Some customers pay, others promise to pay later, and by evening you can't clearly tell how much you earned. Managing business through chat alone creates confusion, missed sales and lost customers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 font-medium">{problem}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

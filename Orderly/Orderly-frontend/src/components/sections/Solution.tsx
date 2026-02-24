import { UsersIcon, ShoppingCartIcon, CreditCardIcon, ChartBarIcon } from 'lucide-react';

export default function Solution() {
  const features = [
    {
      icon: UsersIcon,
      title: "Customer Records",
      description: "Save every buyer with notes and purchase history so you always know who you're talking to.",
      image: "/images/customers-page.png"
    },
    {
      icon: ShoppingCartIcon,
      title: "Order Tracking",
      description: "Record orders in seconds and update status from pending to paid to delivered.",
      image: "/images/orders-page.png"
    },
    {
      icon: CreditCardIcon,
      title: "Payment Monitoring",
      description: "Quickly identify customers that haven't completed payment and follow up confidently.",
      image: "/images/payments.png"
    },
    {
      icon: ChartBarIcon,
      title: "Sales Overview",
      description: "View total orders, revenue and performance at a glance.",
      image: "/images/analytics.png"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            One simple workspace for your entire business
          </h2>
        </div>

        <div className="space-y-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isEven = index % 2 === 1;
            
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`space-y-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Image */}
                <div className={`${isEven ? 'lg:order-1' : ''}`}>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

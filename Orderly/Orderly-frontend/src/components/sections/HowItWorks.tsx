import { MessageCircleIcon, EditIcon, BarChart3Icon } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: MessageCircleIcon,
      title: "Chat normally",
      description: "Continue selling through WhatsApp like you always do"
    },
    {
      icon: EditIcon,
      title: "Record the order",
      description: "Log customer and order details in seconds"
    },
    {
      icon: BarChart3Icon,
      title: "Stay organized",
      description: "Orderly keeps your records, reminders and sales in one place"
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            
            return (
              <div key={index} className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

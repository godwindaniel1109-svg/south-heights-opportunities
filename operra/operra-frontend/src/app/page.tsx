export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-text mb-6 leading-tight">
              Run your business from one<br />
              <span className="text-primary">intelligent workspace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Operra gives companies full visibility into sales, finance, staff performance, 
              and daily operations — without spreadsheets or scattered tools.
            </p>
            <div className="flex gap-4 mb-6">
              <a href="/signup" className="btn-primary text-lg px-8 py-3">
                Start Free Trial
              </a>
              <a href="/signup" className="border-2 border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors font-medium text-lg">
                Book Demo
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Built for growing teams and structured businesses
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">₦2.4M</div>
                <div className="text-sm opacity-90">Revenue</div>
              </div>
              <div className="bg-accent text-white p-4 rounded-lg">
                <div className="text-2xl font-bold">142</div>
                <div className="text-sm opacity-90">Customers</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-text">₦847K</div>
                <div className="text-sm text-gray-600">Profit</div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="text-2xl font-bold text-text">12</div>
                <div className="text-sm text-gray-600">Staff</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-4">
              Designed for real operational workflows
            </div>
            <div className="flex justify-center gap-8 text-gray-600">
              <span className="font-medium">Retail</span>
              <span className="font-medium">Logistics</span>
              <span className="font-medium">Agencies</span>
              <span className="font-medium">Service Companies</span>
              <span className="font-medium">Wholesalers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">
              Businesses don't fail from lack of effort —<br />
              they fail from lack of clarity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="text-danger text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg mb-2">No Financial Visibility</h3>
              <p className="text-gray-600">Owners don't know real profit</p>
            </div>
            <div className="card text-center">
              <div className="text-danger text-4xl mb-4">👥</div>
              <h3 className="font-semibold text-lg mb-2">No Staff Accountability</h3>
              <p className="text-gray-600">Work gets done but no one tracks performance</p>
            </div>
            <div className="card text-center">
              <div className="text-danger text-4xl mb-4">📱</div>
              <h3 className="font-semibold text-lg mb-2">Scattered Tools</h3>
              <p className="text-gray-600">WhatsApp, paper, Excel, memory</p>
            </div>
            <div className="card text-center">
              <div className="text-danger text-4xl mb-4">❓</div>
              <h3 className="font-semibold text-lg mb-2">No Operational Control</h3>
              <p className="text-gray-600">Decisions are guesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text mb-4">
              Operra centralizes your entire business
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Financial Control</h3>
              <p className="text-gray-600">Track revenue, expenses and profit in real time</p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Customer Intelligence</h3>
              <p className="text-gray-600">Understand buying patterns and balances</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👔</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Team Accountability</h3>
              <p className="text-gray-600">Roles, permissions and activity logs</p>
            </div>
            <div className="text-center">
              <div className="bg-accent text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Operational Productivity</h3>
              <p className="text-gray-600">Tasks, deadlines and performance tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Structure creates profit.<br />
            Start running your business intentionally.
          </h2>
          <div className="flex gap-4 justify-center mt-8">
            <a href="/signup" className="bg-white text-primary px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
              Start Free Trial
            </a>
            <a href="/signup" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary transition-colors font-medium text-lg">
              Schedule Demo
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

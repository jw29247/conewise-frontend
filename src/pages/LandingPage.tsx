import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      
      {/* Traffic signal accent - integrated into design */}
      <div className="absolute top-1/3 left-0 transform -translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="flex flex-col gap-8">
          <div className="w-48 h-48 rounded-full bg-red-500 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="w-48 h-48 rounded-full bg-amber-500 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="w-48 h-48 rounded-full bg-green-500 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      {/* Header */}
      <header className="relative z-20 px-8 py-6">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <Logo className="text-gray-900" size="lg" />
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button variant="brand" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-7xl font-extralight text-gray-900 mb-8 leading-tight">
              Traffic Management<br />
              Made <span className="font-normal">Simple</span> and<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">Compliant.</span>
            </h1>
            <p className="text-2xl text-gray-600 font-light mb-12 leading-relaxed">
              Conewise uses AI to transform complex traffic planning into a streamlined process, 
              ensuring 100% compliance with UK standards while saving you time and money.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button variant="brand" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="secondary" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-8 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">70% Faster</h3>
              <p className="text-gray-600">Plan creation vs traditional methods</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">100% Compliant</h3>
              <p className="text-gray-600">With UK traffic management standards</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-xl mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <h3 className="text-4xl font-light text-gray-900 mb-2">50% Lower Cost</h3>
              <p className="text-gray-600">Per traffic management plan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extralight text-gray-900 mb-6">
              Everything You Need to<br />
              <span className="font-normal">Manage Traffic Safely</span>
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Powerful features designed specifically for UK traffic management professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">AI-Powered Planning</h3>
              <p className="text-gray-600 font-light">
                Generate compliant traffic management plans in minutes, not hours. Our AI understands UK regulations.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Compliance Guaranteed</h3>
              <p className="text-gray-600 font-light">
                Every plan meets current UK traffic management standards. Automatic updates when regulations change.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Cost Effective</h3>
              <p className="text-gray-600 font-light">
                Reduce planning costs by 50% while improving accuracy. Pay only for what you use.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-600 font-light">
                Work together seamlessly. Share plans, get approvals, and manage your entire team from one platform.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Visual Planning</h3>
              <p className="text-gray-600 font-light">
                Interactive maps and visual tools make planning intuitive. See your plans come to life in real-time.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-3">Version Control</h3>
              <p className="text-gray-600 font-light">
                Track changes, manage revisions, and maintain a complete audit trail for every plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-8 py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-extralight text-white mb-6">
            Ready to Transform Your<br />
            <span className="font-normal">Traffic Management?</span>
          </h2>
          <p className="text-xl text-gray-300 font-light mb-10">
            Join forward-thinking traffic management professionals who are already saving time and money with Conewise.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button variant="secondary" size="lg">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo className="text-gray-900" size="md" />
              <p className="mt-2 text-sm text-gray-500">
                © 2025 Conewise LTD. All rights reserved.
              </p>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms of Service</a>
              <a href="#" className="hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
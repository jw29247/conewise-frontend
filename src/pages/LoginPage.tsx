import { useLocation } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import Logo from '../components/ui/Logo';

const LoginPage = () => {
  const location = useLocation();
  const requireAuth = location.state?.requireAuth;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      
      {/* Logo at top left of entire page */}
      <div className="absolute top-8 left-8 z-20">
        <Logo className="text-gray-900" size="lg" />
      </div>
      
      {/* Traffic signal accent - integrated into design */}
      <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-20">
        <div className="flex flex-col gap-8">
          <div className="w-32 h-32 rounded-full bg-red-500 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="w-32 h-32 rounded-full bg-amber-500 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="w-32 h-32 rounded-full bg-green-500 blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      {/* Main content container */}
      <div className="min-h-screen flex relative z-10">
        {/* Left side - Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="bg-white rounded-3xl shadow-xl p-10 mx-auto w-full max-w-sm lg:max-w-md relative">
            {requireAuth && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">Sign in required</h3>
                    <p className="mt-1 text-sm text-amber-700">Please sign in to access this page.</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <h2 className="text-4xl font-light text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Enter your credentials to access your traffic management dashboard.
              </p>
            </div>

            <div className="mt-10">
              <LoginForm />
            </div>
            
            <p className="mt-10 text-center text-xs text-gray-400">
              © 2025 Conewise LTD. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Marketing/Preview */}
        <div className="hidden lg:block relative flex-1">
          <div className="flex flex-col justify-center items-center h-full px-12">
            <div className="max-w-lg">
              <h1 className="text-6xl font-extralight text-gray-900 mb-8 leading-tight">
                Plan <span className="font-normal">Smarter.</span><br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">Deliver Faster.</span><br />
                Stay <span className="font-normal">Compliant.</span>
              </h1>
              <p className="text-gray-600 text-xl leading-relaxed font-light">
                Conewise transforms traffic management planning into a simple, efficient process — saving you time, reducing costs, and producing fully compliant plans you can trust.
              </p>
              
              {/* Key Benefits - Elevated Design */}
              <div className="mt-16 space-y-6">
                <div className="flex items-center gap-6 opacity-0 animate-fade-in-left" style={{ animationDelay: '200ms' }}>
                  <div className="w-1 h-16 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                  <div>
                    <p className="text-3xl font-light text-gray-900">70% <span className="text-xl">Faster</span></p>
                    <p className="text-sm text-gray-500 mt-1">Plan creation time reduced</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 opacity-0 animate-fade-in-left" style={{ animationDelay: '400ms' }}>
                  <div className="w-1 h-16 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                  <div>
                    <p className="text-3xl font-light text-gray-900">100% <span className="text-xl">Compliant</span></p>
                    <p className="text-sm text-gray-500 mt-1">UK traffic management standards</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 opacity-0 animate-fade-in-left" style={{ animationDelay: '600ms' }}>
                  <div className="w-1 h-16 bg-gradient-to-b from-red-500 to-red-600 rounded-full"></div>
                  <div>
                    <p className="text-3xl font-light text-gray-900">50% <span className="text-xl">Lower Cost</span></p>
                    <p className="text-sm text-gray-500 mt-1">Per traffic management plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 right-8">
          <a href="#" className="text-white/80 hover:text-white text-sm">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
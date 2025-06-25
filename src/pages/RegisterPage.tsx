import RegisterForm from '../components/Auth/RegisterForm';
import Logo from '../components/ui/Logo';

const RegisterPage = () => {
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
        {/* Left side - Register Form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="bg-white rounded-3xl shadow-xl p-10 mx-auto w-full max-w-sm lg:max-w-md relative">
            <div>
              <h2 className="text-4xl font-light text-gray-900 tracking-tight">
                Get Started
              </h2>
              <p className="mt-3 text-base text-gray-500">
                Create your account to begin managing traffic plans efficiently.
              </p>
            </div>

            <div className="mt-10">
              <RegisterForm />
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
                Join the <span className="font-normal">Smarter</span><br />
                Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-green-600">Manage Traffic.</span>
              </h1>
              <p className="text-gray-600 text-xl leading-relaxed font-light">
                Transform how you create traffic management plans with AI-powered tools designed specifically for UK standards.
              </p>
              
              {/* Key Benefits - Same as login */}
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
      </div>
    </div>
  );
};

export default RegisterPage;
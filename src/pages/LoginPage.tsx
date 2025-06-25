import LoginForm from '../components/Auth/LoginForm';
import Card from '../components/ui/Card';
import Logo from '../components/ui/Logo';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your ConeWise account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-in">
        <Card variant="elevated" padding="lg">
          <LoginForm />
        </Card>
        
        <p className="mt-8 text-center text-xs text-gray-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
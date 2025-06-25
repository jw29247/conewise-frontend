import RegisterForm from '../components/Auth/RegisterForm';
import Card from '../components/ui/Card';
import Logo from '../components/ui/Logo';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Get started with ConeWise
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your account to begin managing traffic plans
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-slide-in">
        <Card variant="elevated" padding="lg">
          <RegisterForm />
        </Card>
        
        <p className="mt-8 text-center text-xs text-gray-500">
          By creating an account, you agree to our{' '}
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

export default RegisterPage;
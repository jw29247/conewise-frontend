import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingIndicator from '../ui/LoadingIndicator';

interface RegisterFormData {
  email: string;
  password: string;
  company_name: string;
}

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', data);
      login(response.data.token);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError('root', { message: error.response.data.message });
      } else {
        setError('root', { message: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <LoadingIndicator size="md" />
        </div>
      )}
      
      {/* Warning about existing companies */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-amber-800">
              Joining an existing company?
            </h3>
            <p className="mt-1 text-sm text-amber-700">
              If your company already uses Conewise, please contact your company's account administrator to add you as a user. This form creates a new company account.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="company_name" className="block text-sm font-light text-gray-600 mb-2">
          Company Name
        </label>
        <input
          id="company_name"
          type="text"
          autoComplete="organization"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400"
          placeholder="Your company name"
          {...register('company_name', { required: 'Company name is required' })}
        />
        {errors.company_name && (
          <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">This will be your organization's name in Conewise</p>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-light text-gray-600 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400"
          placeholder="Enter your email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-light text-gray-600 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400"
          placeholder="Create a password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
      </div>

      {errors.root && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{errors.root.message}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="brand"
        className="w-full"
        size="lg"
        isLoading={isLoading}
      >
        Create Account
      </Button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-white text-gray-400 uppercase tracking-wider">Or continue with</span>
        </div>
      </div>

      <div className="w-full">
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-100 rounded-xl text-sm font-light text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all shadow-sm hover:shadow"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <div className="text-center pt-4">
        <span className="text-sm text-gray-500 font-light">Already have an account? </span>
        <Link to="/login" className="text-sm font-normal text-gray-900 hover:text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 transition-all">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
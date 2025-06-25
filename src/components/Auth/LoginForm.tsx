import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../ui/Button';
import LoadingIndicator from '../ui/LoadingIndicator';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);

  const from = location.state?.from || '/dashboard';

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      login(response.data.token);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          setError('root', { message: axiosError.response.data.message });
        } else {
          setError('root', { message: 'An error occurred. Please try again.' });
        }
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
          autoComplete="current-password"
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all placeholder-gray-400"
          placeholder="Enter your password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-offset-0"
            {...register('rememberMe')}
          />
          <span className="ml-2 text-sm text-gray-600 font-light">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-gray-800 font-light hover:underline">
          Forgot password?
        </Link>
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
        Log In
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
        <span className="text-sm text-gray-500 font-light">New to ConeWise? </span>
        <Link to="/register" className="text-sm font-normal text-gray-900 hover:text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-500 transition-all">
          Create an account
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
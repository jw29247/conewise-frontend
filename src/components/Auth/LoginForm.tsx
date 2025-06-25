import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', data);
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
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email?.message}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        {...register('password', { required: 'Password is required' })}
        error={errors.password?.message}
      />

      {errors.root && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-slide-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{errors.root.message}</p>
            </div>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
      >
        Sign in
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
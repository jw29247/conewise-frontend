import React from 'react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title, 
  subtitle,
  showCreateButton = false,
  createButtonText = 'Create New Plan',
  onCreateClick
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <h1 className="text-2xl font-light text-gray-900">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-4">
          {showCreateButton && (
            <Button variant="brand" onClick={onCreateClick}>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {createButtonText}
            </Button>
          )}
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500">Account Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-medium">
              JS
            </div>
          </div>
          
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
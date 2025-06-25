import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  title, 
  subtitle,
  showCreateButton,
  createButtonText,
  onCreateClick
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50"></div>
      
      {/* Traffic signal accent - subtle in corner */}
      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 opacity-10">
        <div className="flex gap-4">
          <div className="w-64 h-64 rounded-full bg-red-500 blur-3xl"></div>
          <div className="w-64 h-64 rounded-full bg-amber-500 blur-3xl"></div>
          <div className="w-64 h-64 rounded-full bg-green-500 blur-3xl"></div>
        </div>
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <TopNav 
            title={title} 
            subtitle={subtitle}
            showCreateButton={showCreateButton}
            createButtonText={createButtonText}
            onCreateClick={onCreateClick}
          />

          {/* Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
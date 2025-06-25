import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notifications, setNotifications] = useState({
    emailPlanApproved: true,
    emailPlanRejected: true,
    emailTeamInvite: true,
    emailWeeklyReport: false,
    pushPlanUpdates: true,
    pushMentions: true,
    pushDeadlines: true
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Plans', 
      path: '/plans',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    { 
      name: 'Team', 
      path: '/team',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      active: true
    },
  ];

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'api', label: 'API', icon: '🔌' },
  ];

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
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col`}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <Logo className="text-gray-900" size="lg" showText={sidebarOpen} />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-light transition-all ${
                  item.active 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={sidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-light text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
              </div>
              
              <div className="flex items-center gap-4">
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

          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-100 px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Smith"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Email Address</label>
                        <input
                          type="email"
                          defaultValue="john.smith@conewise.com"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+44 7700 900123"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-light text-gray-600 mb-2">Bio</label>
                      <textarea
                        rows={3}
                        defaultValue="Senior Traffic Management Planner with 10+ years of experience."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all resize-none"
                      />
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="brand">Save Changes</Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Preferences</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Language</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all">
                          <option>English (UK)</option>
                          <option>English (US)</option>
                          <option>Welsh</option>
                          <option>Scottish Gaelic</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Timezone</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all">
                          <option>GMT (London)</option>
                          <option>BST (British Summer Time)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Date Format</label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Settings */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Company Information</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Company Name</label>
                        <input
                          type="text"
                          defaultValue="TrafficPro Solutions Ltd"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-light text-gray-600 mb-2">Registration Number</label>
                          <input
                            type="text"
                            defaultValue="12345678"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-light text-gray-600 mb-2">VAT Number</label>
                          <input
                            type="text"
                            defaultValue="GB 123 4567 89"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Company Address</label>
                        <input
                          type="text"
                          defaultValue="123 High Street"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all mb-3"
                          placeholder="Street Address"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            defaultValue="Manchester"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            defaultValue="Greater Manchester"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                            placeholder="County"
                          />
                          <input
                            type="text"
                            defaultValue="M1 2AB"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                            placeholder="Postcode"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="brand">Update Company Info</Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Branding</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Company Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <Button variant="secondary" size="sm">Upload Logo</Button>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 2MB</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Brand Color</label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            defaultValue="#10b981"
                            className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                          />
                          <span className="text-sm text-gray-600">#10b981</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Email Notifications</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'emailPlanApproved', label: 'Plan Approved', description: 'Get notified when your plans are approved' },
                        { key: 'emailPlanRejected', label: 'Plan Rejected', description: 'Get notified when your plans need revision' },
                        { key: 'emailTeamInvite', label: 'Team Invitations', description: 'Get notified when someone joins your team' },
                        { key: 'emailWeeklyReport', label: 'Weekly Reports', description: 'Receive weekly summary of your team\'s activity' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Push Notifications</h2>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'pushPlanUpdates', label: 'Plan Updates', description: 'Real-time updates on plan status changes' },
                        { key: 'pushMentions', label: 'Mentions', description: 'When someone mentions you in a comment' },
                        { key: 'pushDeadlines', label: 'Deadlines', description: 'Reminders for upcoming plan deadlines' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start gap-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Billing */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6 text-white">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-medium">Current Plan</h2>
                        <p className="text-3xl font-light mt-2">Professional</p>
                        <p className="text-gray-300 mt-1">£299 per month</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-400">Users</p>
                        <p className="text-xl font-light">6 / 10</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Credits Used</p>
                        <p className="text-xl font-light">358 / 500</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Next Billing</p>
                        <p className="text-xl font-light">July 1, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm">Upgrade Plan</Button>
                      <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/2026</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Update</Button>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="secondary" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Payment Method
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Billing History</h2>
                    
                    <div className="space-y-3">
                      {[
                        { date: 'June 1, 2025', amount: '£299.00', status: 'Paid', invoice: 'INV-2025-06' },
                        { date: 'May 1, 2025', amount: '£299.00', status: 'Paid', invoice: 'INV-2025-05' },
                        { date: 'April 1, 2025', amount: '£299.00', status: 'Paid', invoice: 'INV-2025-04' },
                        { date: 'March 1, 2025', amount: '£299.00', status: 'Paid', invoice: 'INV-2025-03' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.date}</p>
                            <p className="text-xs text-gray-500">{item.invoice}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">{item.amount}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              {item.status}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                        <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light text-gray-600 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="brand">Update Password</Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Two-Factor Authentication</h2>
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <Button variant="secondary" size="sm">Enable 2FA</Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Active Sessions</h2>
                    
                    <div className="space-y-4">
                      {[
                        { device: 'Chrome on MacBook Pro', location: 'Manchester, UK', time: 'Current session', current: true },
                        { device: 'Safari on iPhone', location: 'London, UK', time: '2 hours ago', current: false },
                        { device: 'Chrome on Windows', location: 'Birmingham, UK', time: '1 day ago', current: false },
                      ].map((session, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{session.device}</p>
                            <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                          </div>
                          {session.current ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Current
                            </span>
                          ) : (
                            <Button variant="ghost" size="sm">Revoke</Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <h2 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h2>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-100"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}

              {/* API */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">API Keys</h2>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex gap-3">
                        <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                          <h3 className="text-sm font-medium text-amber-800">Keep your API keys secure</h3>
                          <p className="mt-1 text-sm text-amber-700">
                            Never share your API keys or commit them to version control.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Production API Key</p>
                            <p className="text-xs text-gray-500">Created on March 15, 2025</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Regenerate</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <code className="flex-1 px-3 py-2 bg-white rounded border border-gray-200 text-sm font-mono">
                            sk_live_••••••••••••••••••••••••••••••••
                          </code>
                          <Button variant="secondary" size="sm">Copy</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Test API Key</p>
                            <p className="text-xs text-gray-500">Created on March 15, 2025</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">Regenerate</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <code className="flex-1 px-3 py-2 bg-white rounded border border-gray-200 text-sm font-mono">
                            sk_test_••••••••••••••••••••••••••••••••
                          </code>
                          <Button variant="secondary" size="sm">Copy</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button variant="brand">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New API Key
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">API Documentation</h2>
                    
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-600">
                        Access our comprehensive API documentation to integrate Conewise into your workflow.
                      </p>
                      
                      <div className="mt-4 space-y-3">
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Getting Started Guide</p>
                            <p className="text-xs text-gray-500">Learn the basics of our API</p>
                          </div>
                        </a>
                        
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">API Reference</p>
                            <p className="text-xs text-gray-500">Detailed endpoint documentation</p>
                          </div>
                        </a>
                        
                        <a href="#" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900">SDKs & Libraries</p>
                            <p className="text-xs text-gray-500">Official client libraries</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Delete Account</h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and will permanently delete:
              </p>
              
              <ul className="text-sm text-gray-600 mb-6 space-y-1">
                <li>• All your traffic plans</li>
                <li>• Your team memberships</li>
                <li>• Your account settings</li>
                <li>• Your billing information</li>
              </ul>
              
              <div className="mb-6">
                <label className="block text-sm font-light text-gray-600 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent focus:bg-white transition-all"
                  placeholder="DELETE"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1 text-red-600 hover:bg-red-50" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Delete My Account
                </Button>
                <Button variant="secondary" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
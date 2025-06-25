import { Link } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const stats = [
    { 
      name: 'Active Plans', 
      value: '12', 
      change: '+8%', 
      changeType: 'increase',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green'
    },
    { 
      name: 'Pending Review', 
      value: '5', 
      change: '+2%', 
      changeType: 'increase',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'amber'
    },
    { 
      name: 'Total Plans', 
      value: '142', 
      change: '+28%', 
      changeType: 'increase',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'gray'
    },
    { 
      name: 'Credits Left', 
      value: '358', 
      change: '-5%', 
      changeType: 'decrease',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red'
    },
  ];

  const recentPlans = [
    { id: 1, name: 'A1 Roadworks - Mile 42-45', status: 'active', date: '2025-06-20', location: 'Manchester', type: 'roadworks' },
    { id: 2, name: 'M25 Emergency Lane Closure', status: 'completed', date: '2025-06-19', location: 'London', type: 'emergency' },
    { id: 3, name: 'City Center Construction Zone', status: 'pending', date: '2025-06-18', location: 'Birmingham', type: 'construction' },
    { id: 4, name: 'Bridge Maintenance Works', status: 'active', date: '2025-06-17', location: 'Leeds', type: 'maintenance' },
    { id: 5, name: 'Event Traffic Management', status: 'pending', date: '2025-06-16', location: 'Liverpool', type: 'event' },
  ];

  return (
    <AppLayout 
      title="Welcome back!"
      subtitle="Here's what's happening with your traffic management plans."
    >
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  stat.color === 'red' ? 'bg-red-50 text-red-600' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-light text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{stat.name}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Plans */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Plans</h2>
                  <Button variant="ghost" size="sm">View all</Button>
                </div>
              </div>
              <div className="divide-y divide-gray-50">
                {recentPlans.map((plan) => (
                  <div key={plan.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-medium text-gray-900">{plan.name}</h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            plan.status === 'active' 
                              ? 'bg-green-100 text-green-700'
                              : plan.status === 'completed'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{plan.location} • {plan.date}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Credits */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/generate-plan" className="block">
                  <Button variant="brand" className="w-full" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Plan
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full">
                  Import Existing Plan
                </Button>
                <Button variant="ghost" className="w-full">
                  View Templates
                </Button>
              </div>
            </div>

            {/* Credits */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-sm p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Credits Balance</h2>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-light">358</p>
                <p className="text-sm text-gray-300 mt-1">credits remaining</p>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: '71.6%' }}></div>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Purchase More Credits
              </Button>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Plan approved</p>
                    <p className="text-xs text-gray-500">M25 Emergency Lane Closure • 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Review requested</p>
                    <p className="text-xs text-gray-500">City Center Construction • 5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Team member added</p>
                    <p className="text-xs text-gray-500">Sarah Johnson joined • Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default Dashboard;
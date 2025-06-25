import Layout from '../components/Layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const stats = [
    { name: 'Total Plans', value: '24', change: '+12%', changeType: 'increase' },
    { name: 'Active Plans', value: '8', change: '+3%', changeType: 'increase' },
    { name: 'Completed', value: '16', change: '+8%', changeType: 'increase' },
    { name: 'Credits Used', value: '142', change: '-5%', changeType: 'decrease' },
  ];

  const recentPlans = [
    { id: 1, name: 'A1 Roadworks - Mile 42', status: 'active', date: '2024-01-20', location: 'Manchester' },
    { id: 2, name: 'M25 Emergency Repairs', status: 'completed', date: '2024-01-19', location: 'London' },
    { id: 3, name: 'City Center Construction', status: 'pending', date: '2024-01-18', location: 'Birmingham' },
    { id: 4, name: 'Bridge Maintenance', status: 'active', date: '2024-01-17', location: 'Leeds' },
  ];

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here's an overview of your traffic management plans.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.name} variant="bordered" className="animate-slide-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    stat.changeType === 'increase' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Plans */}
            <div className="lg:col-span-2">
              <Card variant="default" className="animate-slide-in">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Recent Plans</h2>
                    <Button variant="secondary" size="sm">View all</Button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentPlans.map((plan) => (
                    <div key={plan.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                          <p className="text-sm text-gray-500">{plan.location} • {plan.date}</p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          plan.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : plan.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {plan.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card variant="default" className="animate-slide-in">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create New Plan
                    </Button>
                    <Button variant="secondary" className="w-full">
                      View All Plans
                    </Button>
                    <Button variant="ghost" className="w-full">
                      Manage Team
                    </Button>
                  </div>
                </div>
              </Card>

              <Card variant="default" className="mt-4 animate-slide-in">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Credits Balance</h2>
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-gray-900">358</p>
                    <p className="text-sm text-gray-500">credits remaining</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '71.6%' }}></div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    Purchase Credits
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
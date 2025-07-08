import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/ui/Button';

const PlansPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const plans = [
    {
      id: 1,
      name: 'A1 Roadworks - Mile 42-45',
      status: 'active',
      date: '2025-06-20',
      street: 'A1 North Road',
      city: 'Manchester',
      postcode: 'M1 2AB',
      type: 'roadworks',
      duration: '3 days',
      completedSteps: 5,
      totalSteps: 5,
      lastModified: '2 hours ago',
      assignee: 'John Smith',
      priority: 'high'
    },
    {
      id: 2,
      name: 'M25 Emergency Lane Closure',
      status: 'completed',
      date: '2025-06-19',
      street: 'M25 Junction 15',
      city: 'London',
      postcode: 'TW19 5NE',
      type: 'emergency',
      duration: '6 hours',
      completedSteps: 8,
      totalSteps: 8,
      lastModified: '1 day ago',
      assignee: 'Sarah Johnson',
      priority: 'urgent'
    },
    {
      id: 3,
      name: 'City Center Construction Zone',
      status: 'pending',
      date: '2025-06-18',
      street: 'Corporation Street',
      city: 'Birmingham',
      postcode: 'B2 4ND',
      type: 'construction',
      duration: '2 weeks',
      completedSteps: 2,
      totalSteps: 6,
      lastModified: '3 days ago',
      assignee: 'Mike Wilson',
      priority: 'medium'
    },
    {
      id: 4,
      name: 'Bridge Maintenance Works',
      status: 'active',
      date: '2025-06-17',
      street: 'Crown Point Road',
      city: 'Leeds',
      postcode: 'LS9 8DX',
      type: 'maintenance',
      duration: '5 days',
      completedSteps: 3,
      totalSteps: 7,
      lastModified: '4 hours ago',
      assignee: 'Emma Davis',
      priority: 'medium'
    },
    {
      id: 5,
      name: 'Event Traffic Management',
      status: 'draft',
      date: '2025-06-16',
      street: 'Anfield Road',
      city: 'Liverpool',
      postcode: 'L4 0TH',
      type: 'event',
      duration: '1 day',
      completedSteps: 1,
      totalSteps: 4,
      lastModified: '5 days ago',
      assignee: 'Tom Brown',
      priority: 'low'
    },
    {
      id: 6,
      name: 'Utility Works - Water Main',
      status: 'review',
      date: '2025-06-15',
      street: 'Ecclesall Road',
      city: 'Sheffield',
      postcode: 'S11 8PY',
      type: 'utility',
      duration: '4 days',
      completedSteps: 4,
      totalSteps: 5,
      lastModified: '6 hours ago',
      assignee: 'Lisa White',
      priority: 'high'
    }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'draft': return 'bg-blue-100 text-blue-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.postcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreatePlan = () => {
    navigate('/generate-plan');
  };

  return (
    <AppLayout 
      title="Traffic Management Plans"
      subtitle="Manage and track all your traffic management plans"
      showCreateButton={true}
      createButtonText="Create New Plan"
      onCreateClick={handleCreatePlan}
    >
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">

        {/* Filters and Search */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all text-sm"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="review">In Review</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {filteredPlans.length} plans found
              </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
                    {/* Plan Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.street}</p>
                        <p className="text-sm text-gray-500">{plan.city}, {plan.postcode}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                        {plan.status}
                      </span>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="text-gray-900">{plan.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Priority</span>
                        <span className={`font-medium ${getPriorityColor(plan.priority)}`}>
                          {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Assignee</span>
                        <span className="text-gray-900">{plan.assignee}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{plan.completedSteps}/{plan.totalSteps} steps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full transition-all"
                          style={{ width: `${(plan.completedSteps / plan.totalSteps) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Modified {plan.lastModified}</span>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                            <p className="text-xs text-gray-500">{plan.duration}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">{plan.street}</p>
                            <p className="text-xs text-gray-500">{plan.city}, {plan.postcode}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${getPriorityColor(plan.priority)}`}>
                            {plan.priority.charAt(0).toUpperCase() + plan.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-1.5 rounded-full"
                                style={{ width: `${(plan.completedSteps / plan.totalSteps) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{plan.completedSteps}/{plan.totalSteps}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{plan.assignee}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{plan.lastModified}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {filteredPlans.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No plans found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                <Button variant="brand">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Plan
                </Button>
              </div>
            )}
        </div>
      </main>
    </AppLayout>
  );
};

export default PlansPage;
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TeamPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@conewise.com',
      role: 'admin',
      department: 'Management',
      status: 'active',
      lastActive: '2 minutes ago',
      plansCreated: 42,
      plansReviewed: 156,
      joinedDate: '2024-01-15',
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@conewise.com',
      role: 'planner',
      department: 'Traffic Planning',
      status: 'active',
      lastActive: '1 hour ago',
      plansCreated: 89,
      plansReviewed: 34,
      joinedDate: '2024-03-22',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@conewise.com',
      role: 'reviewer',
      department: 'Quality Assurance',
      status: 'active',
      lastActive: '3 hours ago',
      plansCreated: 0,
      plansReviewed: 203,
      joinedDate: '2024-02-10',
      avatar: 'MW'
    },
    {
      id: 4,
      name: 'Emma Davis',
      email: 'emma.davis@conewise.com',
      role: 'planner',
      department: 'Traffic Planning',
      status: 'away',
      lastActive: '2 days ago',
      plansCreated: 67,
      plansReviewed: 12,
      joinedDate: '2024-04-05',
      avatar: 'ED'
    },
    {
      id: 5,
      name: 'Tom Brown',
      email: 'tom.b@conewise.com',
      role: 'viewer',
      department: 'Client Services',
      status: 'active',
      lastActive: '5 hours ago',
      plansCreated: 0,
      plansReviewed: 0,
      joinedDate: '2024-05-18',
      avatar: 'TB'
    },
    {
      id: 6,
      name: 'Lisa White',
      email: 'lisa.white@conewise.com',
      role: 'planner',
      department: 'Traffic Planning',
      status: 'inactive',
      lastActive: '1 week ago',
      plansCreated: 31,
      plansReviewed: 8,
      joinedDate: '2024-01-28',
      avatar: 'LW'
    }
  ];

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
      ),
      active: true
    },
    { 
      name: 'Settings', 
      path: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'planner': return 'bg-blue-100 text-blue-700';
      case 'reviewer': return 'bg-green-100 text-green-700';
      case 'viewer': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-amber-500';
      case 'inactive': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Members', value: teamMembers.length, color: 'text-gray-900' },
    { label: 'Active Now', value: teamMembers.filter(m => m.status === 'active').length, color: 'text-green-600' },
    { label: 'Admins', value: teamMembers.filter(m => m.role === 'admin').length, color: 'text-purple-600' },
    { label: 'Planners', value: teamMembers.filter(m => m.role === 'planner').length, color: 'text-blue-600' },
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
            {sidebarOpen && (
              <div className="bg-gradient-to-br from-amber-50 to-green-50 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900">Team tip</h3>
                <p className="mt-1 text-xs text-gray-600">
                  Assign the right roles to keep your plans secure and organized.
                </p>
              </div>
            )}
            
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
                <h1 className="text-2xl font-light text-gray-900">Team Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your team members and their permissions</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="brand" onClick={() => setShowInviteModal(true)}>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite Member
                </Button>
                
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

          {/* Stats Bar */}
          <div className="bg-white border-b border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{stat.label}:</span>
                    <span className={`text-2xl font-light ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white border-b border-gray-100 px-8 py-4">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all text-sm"
                />
              </div>

              {/* Role Filter */}
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="planner">Planner</option>
                <option value="reviewer">Reviewer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  {/* Member Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                    </div>
                  </div>

                  {/* Member Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Role</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Department</span>
                      <span className="text-gray-900">{member.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Plans Created</span>
                      <span className="text-gray-900">{member.plansCreated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Plans Reviewed</span>
                      <span className="text-gray-900">{member.plansReviewed}</span>
                    </div>
                  </div>

                  {/* Member Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Active {member.lastActive}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No team members found</p>
                <p className="text-gray-400 text-sm mb-6">Try adjusting your search or filters</p>
                <Button variant="brand" onClick={() => setShowInviteModal(true)}>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite Your First Team Member
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowInviteModal(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Invite Team Member</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="colleague@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">Role</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all">
                    <option value="viewer">Viewer - Can view plans only</option>
                    <option value="planner">Planner - Can create and edit plans</option>
                    <option value="reviewer">Reviewer - Can review and approve plans</option>
                    <option value="admin">Admin - Full access to all features</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-light text-gray-600 mb-2">Department</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="e.g., Traffic Planning"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="brand" className="flex-1">
                    Send Invitation
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
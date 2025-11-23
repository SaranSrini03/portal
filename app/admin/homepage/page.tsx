'use client';

import { useAdminAuth } from '../../hooks/useAdminAuth';
import { PageContainer } from '../../components/PageContainer';

export default function AdminHomepage() {
  const { isAuthenticated, logout } = useAdminAuth();

  if (isAuthenticated === null) {
    // Show loading state while checking auth
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Admin</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dashboard Stats Cards */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-blue-800">Total Students</h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">1,234</p>
              <p className="text-sm text-blue-500 mt-1">+12% from last month</p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-green-800">Results Published</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">856</p>
              <p className="text-sm text-green-500 mt-1">+8% from last month</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-medium text-purple-800">Pending Approvals</h3>
              <p className="text-3xl font-bold mt-2 text-purple-600">23</p>
              <p className="text-sm text-purple-500 mt-1">3 new today</p>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h3 className="font-medium text-gray-900">Add New Student</h3>
                <p className="text-sm text-gray-500 mt-1">Register a new student record</p>
              </button>
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h3 className="font-medium text-gray-900">Upload Results</h3>
                <p className="text-sm text-gray-500 mt-1">Upload exam results in bulk</p>
              </button>
              <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                <h3 className="font-medium text-gray-900">View Reports</h3>
                <p className="text-sm text-gray-500 mt-1">Generate and analyze reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { PageContainer } from '../../components/PageContainer';
import { 
  getStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  searchStudents,
  StudentResult 
} from '../../utils/studentApi';

export default function AdminHomepage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<'add' | 'view'>('add');
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [rollNumber, setRollNumber] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (activeSection === 'view') {
      loadStudents();
    }
  }, [activeSection]);

  const loadStudents = async () => {
    setIsLoading(true);
    setError('');
    try {
      let data: StudentResult[];
      if (searchQuery) {
        data = await searchStudents(searchQuery);
      } else {
        data = await getStudents();
      }
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === 'view') {
      loadStudents();
    }
  }, [searchQuery]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !result.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await addStudent(rollNumber, result);
      setRollNumber('');
      setResult('');
      setSuccess('Student added successfully!');
      if (activeSection === 'view') {
        await loadStudents();
      }
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !rollNumber.trim() || !result.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateStudent(editingStudent.id, rollNumber, result);
      setEditingStudent(null);
      setRollNumber('');
      setResult('');
      setSuccess('Student updated successfully!');
      setActiveSection('view');
      await loadStudents();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (student: StudentResult) => {
    setEditingStudent(student);
    setRollNumber(student.rollNumber);
    setResult(student.result);
    setActiveSection('add');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      setIsLoading(true);
      setError('');
      setSuccess('');
      try {
        await deleteStudent(id);
        setSuccess('Student deleted successfully!');
        await loadStudents();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete student');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setRollNumber('');
    setResult('');
  };

  if (isAuthenticated === null) {
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
      <div className="flex h-[calc(100vh-2rem)] gap-4">
        {/* Sidebar */}
        <div className="w-64 bg-white rounded-2xl shadow-xl p-4 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage student results</p>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => {
                setActiveSection('add');
                cancelEdit();
              }}
              className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                activeSection === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Add Student
            </button>
            <button
              onClick={() => {
                setActiveSection('view');
                cancelEdit();
              }}
              className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                activeSection === 'view'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              View Students
            </button>
          </div>

          <div className="mt-auto">
            <button
              onClick={logout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}
          
          {activeSection === 'add' ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              
              <form onSubmit={editingStudent ? handleUpdate : handleAdd} className="max-w-md space-y-4">
                <div>
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter roll number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-2">
                    Result
                  </label>
                  <textarea
                    id="result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter result details"
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Processing...' : editingStudent ? 'Update' : 'Add'} Student
                  </button>
                  {editingStudent && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  View Students ({students.length})
                </h2>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search by roll number or result..."
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {searchQuery ? 'No students found matching your search.' : 'No students added yet.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">
                          Roll Number: {student.rollNumber}
                        </div>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">
                          {student.result}
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Added: {new Date(student.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(student)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

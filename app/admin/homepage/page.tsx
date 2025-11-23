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
} from '../../utils/studentStorage';

export default function AdminHomepage() {
  const { isAuthenticated, logout } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<'add' | 'view'>('add');
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<StudentResult | null>(null);
  
  // Form state
  const [rollNumber, setRollNumber] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (activeSection === 'view') {
      loadStudents();
    }
  }, [activeSection]);

  const loadStudents = () => {
    if (searchQuery) {
      setStudents(searchStudents(searchQuery));
    } else {
      setStudents(getStudents());
    }
  };

  useEffect(() => {
    if (activeSection === 'view') {
      loadStudents();
    }
  }, [searchQuery]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !result.trim()) return;
    
    addStudent(rollNumber, result);
    setRollNumber('');
    setResult('');
    if (activeSection === 'view') {
      loadStudents();
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !rollNumber.trim() || !result.trim()) return;
    
    updateStudent(editingStudent.id, rollNumber, result);
    setEditingStudent(null);
    setRollNumber('');
    setResult('');
    loadStudents();
  };

  const handleEdit = (student: StudentResult) => {
    setEditingStudent(student);
    setRollNumber(student.rollNumber);
    setResult(student.result);
    setActiveSection('add');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      deleteStudent(id);
      loadStudents();
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingStudent ? 'Update' : 'Add'} Student
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

              {students.length === 0 ? (
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
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
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

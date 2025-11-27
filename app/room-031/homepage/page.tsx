'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { PageContainer } from '../../components/PageContainer';
import { 
  getStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent, 
  searchStudents,
  deleteAllStudents,
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
  const [isImporting, setIsImporting] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [name, setName] = useState('');
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
    if (!name.trim() || !rollNumber.trim() || !result.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await addStudent(name, rollNumber, result);
      setName('');
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

  const parseCsvContent = (text: string) => {
    const rows: string[][] = [];
    let current = '';
    let inQuotes = false;
    let row: string[] = [];
    const sanitized = text.replace(/^\uFEFF/, '');

    for (let i = 0; i < sanitized.length; i++) {
      const char = sanitized[i];

      if (char === '"') {
        if (inQuotes && sanitized[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && sanitized[i + 1] === '\n') {
          i++;
        }
        row.push(current.trim());
        if (row.some(cell => cell.length > 0)) {
          rows.push(row);
        }
        row = [];
        current = '';
      } else {
        current += char;
      }
    }

    if (current || row.length) {
      row.push(current.trim());
      if (row.some(cell => cell.length > 0)) {
        rows.push(row);
      }
    }

    return rows;
  };

  const handleCsvButtonClick = () => {
    csvInputRef.current?.click();
  };

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setIsImporting(true);

    try {
      const text = await file.text();
      const rows = parseCsvContent(text);

      if (!rows.length) {
        throw new Error('CSV file is empty.');
      }

      const headers = rows.shift()?.map(value =>
        value.toLowerCase().replace(/[^a-z0-9]/g, '')
      ) || [];

      const nameIndex = headers.findIndex(header =>
        header === 'studentname' || header === 'name' || header === 'fullname'
      );
      const usnIndex = headers.findIndex(header =>
        header === 'usn' || header === 'rollnumber' || header === 'rollno'
      );
      const resultIndex = headers.findIndex(header => header === 'result');

      if (nameIndex === -1 || usnIndex === -1 || resultIndex === -1) {
        throw new Error('CSV must include "Student Name", "USN"/Roll Number and "Result" columns.');
      }

      let imported = 0;
      let skipped = 0;

      for (const row of rows) {
        const studentName = row[nameIndex]?.trim();
        const roll = row[usnIndex]?.trim();
        const resultValue = row[resultIndex]?.trim();

        if (!studentName || !roll || !resultValue) {
          skipped++;
          continue;
        }

        try {
          await addStudent(studentName, roll, resultValue);
          imported++;
        } catch (err) {
          console.error('CSV import error:', err);
          skipped++;
        }
      }

      if (imported === 0) {
        throw new Error('No valid rows were imported. Please verify the CSV content.');
      }

      setSuccess(
        `Imported ${imported} ${imported === 1 ? 'student' : 'students'}${skipped ? ` (${skipped} skipped)` : ''}.`
      );
      if (activeSection === 'view') {
        await loadStudents();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import CSV file.');
    } finally {
      setIsImporting(false);
      if (csvInputRef.current) {
        csvInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAll = async () => {
    if (students.length === 0) {
      setError('No students to delete.');
      return;
    }

    const confirmed = confirm('Are you sure you want to delete all student records? This action cannot be undone.');
    if (!confirmed) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const deletedCount = await deleteAllStudents();
      setStudents([]);
      setSuccess(`Deleted ${deletedCount} ${deletedCount === 1 ? 'record' : 'records'}.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete all students.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !name.trim() || !rollNumber.trim() || !result.trim()) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateStudent(editingStudent.id, name, rollNumber, result);
      setEditingStudent(null);
      setName('');
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
    setName(student.name);
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
    setName('');
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
      <div className="flex flex-col lg:flex-row h-[calc(100vh-2rem)] gap-4">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white rounded-2xl shadow-xl p-5 flex flex-col border border-gray-100">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manage results</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <button
              onClick={() => {
                setActiveSection('add');
                cancelEdit();
              }}
              className={`px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 flex items-center gap-3 ${
                activeSection === 'add'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
            <button
              onClick={() => {
                setActiveSection('view');
                cancelEdit();
              }}
              className={`px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 flex items-center gap-3 ${
                activeSection === 'view'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Students
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg shadow-red-500/30 hover:shadow-xl flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 lg:p-8 overflow-y-auto border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            </div>
          )}
          
          {activeSection === 'add' ? (
            <div>
              <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-xl shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Bulk Import</h3>
                    <p className="text-sm text-gray-600">
                      Upload a CSV file with columns: Student Name, USN, Result to add multiple records at once.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={handleCsvButtonClick}
                      disabled={isImporting}
                      className="flex-1 sm:flex-none px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors text-sm font-semibold disabled:opacity-60"
                    >
                      {isImporting ? 'Importing...' : 'Import CSV'}
                    </button>
                    <a
                      href="/sample-students.csv"
                      download
                      className="flex-1 sm:flex-none px-5 py-3 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
                    >
                      Download Sample
                    </a>
                  </div>
                </div>
                <input
                  ref={csvInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCsvImport}
                />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  {editingStudent ? (
                    <>
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      Edit Student
                    </>
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      Add New Student
                    </>
                  )}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {editingStudent ? 'Update student information below' : 'Fill in the details to add a new student result'}
                </p>
              </div>
              
              <form onSubmit={editingStudent ? handleUpdate : handleAdd} className="max-w-2xl space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Student Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <label htmlFor="rollNumber" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Roll Number
                  </label>
                  <input
                    type="text"
                    id="rollNumber"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                    placeholder="Enter roll number"
                    required
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                  <label htmlFor="result" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Result Details
                  </label>
                  <textarea
                    id="result"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md resize-none"
                    placeholder="Enter result details"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : editingStudent ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Update Student
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                      </>
                    )}
                  </button>
                  {editingStudent && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      View Students
                    </h2>
                    <p className="text-gray-500 text-sm ml-13">
                      {students.length} {students.length === 1 ? 'student' : 'students'} registered
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm hover:shadow-md"
                        placeholder="Search by name, roll number or result..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleDeleteAll}
                      disabled={isLoading || students.length === 0}
                      className="px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading students...</p>
                  </div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    {searchQuery ? 'No students found matching your search.' : 'No students added yet.'}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    {searchQuery ? 'Try a different search term' : 'Start by adding your first student'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {(student.name || student.rollNumber || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 text-lg mb-0.5 break-words">
                                {student.name || 'Name unavailable'}
                              </div>
                              <div className="text-sm text-gray-600 mb-1 break-words">
                                Roll Number: <span className="text-blue-600">{student.rollNumber}</span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Added: {new Date(student.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-gray-100 mt-3">
                            <div className="text-sm font-medium text-gray-600 mb-2">Result Details</div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
                              {student.result}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col sm:ml-4">
                          <button
                            onClick={() => handleEdit(student)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 whitespace-nowrap"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
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

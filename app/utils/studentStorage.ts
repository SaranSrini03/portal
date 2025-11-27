export interface StudentResult {
  id: string;
  name: string;
  rollNumber: string;
  result: string;
  createdAt: string;
}

const STORAGE_KEY = 'student_results';

export const getStudents = (): StudentResult[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addStudent = (name: string, rollNumber: string, result: string): StudentResult => {
  const students = getStudents();
  const newStudent: StudentResult = {
    id: Date.now().toString(),
    name: name.trim(),
    rollNumber: rollNumber.trim(),
    result: result.trim(),
    createdAt: new Date().toISOString(),
  };
  students.push(newStudent);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (id: string, name: string, rollNumber: string, result: string): StudentResult | null => {
  const students = getStudents();
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  students[index] = {
    ...students[index],
    name: name.trim(),
    rollNumber: rollNumber.trim(),
    result: result.trim(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const filtered = students.filter(s => s.id !== id);
  if (filtered.length === students.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

export const getStudentByRollNumber = (rollNumber: string): StudentResult | null => {
  const students = getStudents();
  return students.find(s => s.rollNumber.toLowerCase() === rollNumber.toLowerCase().trim()) || null;
};

export const searchStudents = (query: string): StudentResult[] => {
  const students = getStudents();
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return students;
  return students.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) ||
    s.rollNumber.toLowerCase().includes(lowerQuery) ||
    s.result.toLowerCase().includes(lowerQuery)
  );
};


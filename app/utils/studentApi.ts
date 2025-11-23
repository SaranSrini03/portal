export interface StudentResult {
  id: string;
  rollNumber: string;
  result: string;
  createdAt: string;
}

const API_BASE = '/api/students';

export async function getStudents(): Promise<StudentResult[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch students');
  }
  return response.json();
}

export async function getStudentByRollNumber(rollNumber: string): Promise<StudentResult | null> {
  const response = await fetch(`${API_BASE}?rollNumber=${encodeURIComponent(rollNumber)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch student');
  }
  return response.json();
}

export async function searchStudents(query: string): Promise<StudentResult[]> {
  if (!query.trim()) {
    return getStudents();
  }
  const response = await fetch(`${API_BASE}?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search students');
  }
  return response.json();
}

export async function addStudent(rollNumber: string, result: string): Promise<StudentResult> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rollNumber, result }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add student');
  }
  
  return response.json();
}

export async function updateStudent(id: string, rollNumber: string, result: string): Promise<StudentResult> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rollNumber, result }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update student');
  }
  
  return response.json();
}

export async function deleteStudent(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete student');
  }
  
  return true;
}


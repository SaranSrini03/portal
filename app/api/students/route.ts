import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../lib/mongodb';

export interface StudentResult {
  _id?: string;
  id?: string;
  name: string;
  rollNumber: string;
  result: string;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<StudentResult>('students');
    
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const rollNumber = searchParams.get('rollNumber');

    if (rollNumber) {
      const student = await collection.findOne({ 
        rollNumber: { $regex: new RegExp(`^${rollNumber}$`, 'i') } 
      });
      
      if (!student) {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
      
      return NextResponse.json({
        id: student._id?.toString(),
        name: student.name ?? '',
        rollNumber: student.rollNumber,
        result: student.result,
        createdAt: student.createdAt,
      });
    }

    if (query) {
      const students = await collection.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { rollNumber: { $regex: query, $options: 'i' } },
          { result: { $regex: query, $options: 'i' } },
        ],
      }).toArray();
      
      return NextResponse.json(
        students.map(s => ({
          id: s._id?.toString(),
          name: s.name ?? '',
          rollNumber: s.rollNumber,
          result: s.result,
          createdAt: s.createdAt,
        }))
      );
    }

    const students = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json(
      students.map(s => ({
        id: s._id?.toString(),
        name: s.name ?? '',
        rollNumber: s.rollNumber,
        result: s.result,
        createdAt: s.createdAt,
      }))
    );
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection<StudentResult>('students');
    
    const body = await request.json();
    const { name, rollNumber, result } = body;

    if (!name || !rollNumber || !result) {
      return NextResponse.json(
        { error: 'Name, roll number and result are required' },
        { status: 400 }
      );
    }

    const existingStudent = await collection.findOne({
      rollNumber: { $regex: new RegExp(`^${rollNumber}$`, 'i') },
    });

    if (existingStudent) {
      return NextResponse.json(
        { error: 'Student with this roll number already exists' },
        { status: 400 }
      );
    }

    const newStudent = {
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      result: result.trim(),
      createdAt: new Date().toISOString(),
    };

    const insertResult = await collection.insertOne(newStudent);

    return NextResponse.json({
      id: insertResult.insertedId.toString(),
      ...newStudent,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const db = await getDb();
    const collection = db.collection<StudentResult>('students');

    const deleteResult = await collection.deleteMany({});

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting all students:', error);
    return NextResponse.json(
      { error: 'Failed to delete students' },
      { status: 500 }
    );
  }
}


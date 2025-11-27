import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const collection = db.collection('students');
    
    const body = await request.json();
    const { name, rollNumber, result } = body;

    if (!name || !rollNumber || !result) {
      return NextResponse.json(
        { error: 'Name, roll number and result are required' },
        { status: 400 }
      );
    }

    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          result: result.trim(),
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const updatedStudent = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      id: updatedStudent!._id.toString(),
      name: updatedStudent!.name ?? '',
      rollNumber: updatedStudent!.rollNumber,
      result: updatedStudent!.result,
      createdAt: updatedStudent!.createdAt,
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDb();
    const collection = db.collection('students');
    
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid student ID' },
        { status: 400 }
      );
    }

    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}


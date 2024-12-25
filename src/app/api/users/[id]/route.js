import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import {  getCollection } from '@/lib/connect';
import bcrypt from 'bcrypt'

export async function GET(req, { params }) {
  try {
    const usersCollection = await getCollection('users');
    const id = new ObjectId(params.id);
    const user = await usersCollection.findOne({ _id: id });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {

  const usersCollection = await getCollection("users");
  if (!usersCollection) return NextResponse.json({ errors: { email: "Server error!" } }, { status: 500 });
  try {

    const updates = await request.json();
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updates },
      { returnDocument: 'after', projection: { password: 0 } }
    );

    if (!updatedUser.value) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(updatedUser.value, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error.message);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {

  const usersCollection = await getCollection("users");
  if (!usersCollection) return NextResponse.json({ errors: { email: "Server error!" } }, { status: 500 });
  try {
    const deletedUser = await usersCollection.findOneAndDelete({ _id: new ObjectId(params.id) });

    if (!deletedUser.value) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

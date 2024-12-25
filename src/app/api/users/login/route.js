import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';
import bcrypt from 'bcrypt';

export async function POST(req) {
  const usersCollection = await getCollection('users');

  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const user = await usersCollection.findOne({ name });
    if (!user) {
      return NextResponse.json({ error: 'Invalid name or password' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid name or password' }, { status: 400 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error.message);
    return NextResponse.json({ error: 'Failed to log in' }, { status: 500 });
  }
}
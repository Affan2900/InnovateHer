import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';
import bcrypt from 'bcrypt';

export async function GET() {
  const usersCollection = await getCollection("users");
  if (!usersCollection) return NextResponse.json({ errors: { email: "Server error!" } }, { status: 500 });

  try {
    // Fetch all users excluding the password field
    const users = await usersCollection
      .find({}, { projection: { password: 0 } }) // Exclude the password field
      .toArray();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req) {
  const usersCollection = await getCollection("users");

  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ name });
    if (existingUser) {
      return NextResponse.json({ error: "Name Already Exists" }, { status: 400 });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Set default roles
    const roles = ["buyer"];

    // Create the new user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      roles,
      currentRole: "buyer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new user into the collection
    const result = await usersCollection.insertOne(newUser);

    // Fetch the newly created user excluding the password
    const createdUser = await usersCollection.findOne({ _id: result.insertedId }, { projection: { password: 0 } });

    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error.message);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


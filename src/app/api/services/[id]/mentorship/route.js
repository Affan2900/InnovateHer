import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect'; // Helper to connect to MongoDB
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    const service = await servicesCollection.findOne({ _id: new ObjectId(serviceId), category: 'mentorship' });
    if (!service) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving service:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    const { title, expertise, duration, description, price, category, sellerId } = body;

    // Validate input
    if (!title || !expertise || !duration || !description || !category || !price || !sellerId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Insert new service
    const newService = {
      title,
      expertise,
      duration,
      description,
      category,
      price: parseFloat(price), // Ensure price is stored as a number
      seller: sellerId, // Reference to the seller (user ID)
      customers: [], // Default to an empty array for customers
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await servicesCollection.insertOne(newService);
    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to add service.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Marketplace item added successfully.', newService }, { status: 201 });
  } catch (error) {
    console.error('Error adding marketplace item:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    const { id, title, expertise, duration, description, price, category, sellerId } = body;

    // Validate input
    if (!id || !title || !expertise || !duration || !description || !category || !price || !sellerId) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Update the service
    const updatedService = {
      title,
      expertise,
      duration,
      description,
      category,
      price: parseFloat(price), // Ensure price is stored as a number
      seller: sellerId, // Reference to the seller (user ID)
      updatedAt: new Date(),
    };

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) }, // Match by ID
      { $set: updatedService }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update service.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Service updated successfully.', updatedService }, { status: 200 });
  } catch (error) {
    console.error('Error updating service:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    // Validate input
    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Delete the service
    const result = await servicesCollection.deleteOne({ _id: new ObjectId(serviceId) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete service.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Service deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}


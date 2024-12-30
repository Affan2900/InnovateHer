import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';
import { ObjectId } from 'mongodb';


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');

    // Validate eventId
    if (!serviceId) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Retrieve the event by ID
    const service = await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
    if (!service) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({ service }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving event:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, imageUrl, category, price, sellerId, date, location } = body;

    // Validate input
    if (!title || !description || !imageUrl || !category || !price || !sellerId || !date || !location) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Validate date is greater than or equal to current date
    const chosenDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (chosenDate < currentDate) {
      return NextResponse.json({ 
        error: 'Event date must be greater than or equal to current date.' 
      }, { status: 400 });
    }

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Insert new service
    const newEvent = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      price: parseFloat(price),
      seller: sellerId,
      date: chosenDate,
      imageUrl,
      location: location.trim(),
      customers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await servicesCollection.insertOne(newEvent);
    if (!result.acknowledged) {
      return NextResponse.json({ error: 'Failed to add service.' }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Networking event added successfully.', 
      newEvent // Changed from newService to newEvent to match the variable name
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding networking event:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    const { id, title, location,description, price, category, date, sellerId } = body;

    // Validate input
    if (!id || !title || !date || !description || !category || !price || !sellerId || !location) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Check if the chosen date is equal to or greater than the current date
    const chosenDate = new Date(date);
    const currentDate = new Date();
    if (chosenDate < currentDate) {
      return NextResponse.json({ error: 'The chosen date must be equal to or greater than the current date.' }, { status: 400 });
    }

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Update the service
    const updatedService = {
      title,
      date,
      location,
      description,
      category,
      imageUrl,
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

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Zod schema for marketplace service
const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["marketplace", "skill-building", "mentorship", "networking"]),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(1, { message: "Price is out of range. Allowed range is 1 to 10,000." })
    .max(10000, { message: "Price is out of range. Allowed range is 1 to 10,000." }),
  sellerId: z.string().min(1, "Seller ID is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
});


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

    // Convert price to number if it comes as a string
        if (typeof body.price === "string") body.price = Number(body.price);
    
        // Use safeParse instead of parse to get a result object
        const result = serviceSchema.safeParse(body);
        if (!result.success) {
          // Return the first validation error
          return NextResponse.json(
            { error: result.error.issues[0].message },
            { status: 400 }
          );
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

    const insertResult = await servicesCollection.insertOne(newEvent);
    if (!insertResult.acknowledged) {
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

    // Convert price to number if it comes as a string
        if (typeof body.price === "string") body.price = Number(body.price);
    
        // Use safeParse instead of parse to get a result object
        const result = serviceSchema.safeParse(body);
        if (!result.success) {
          // Return the first validation error
          return NextResponse.json(
            { error: result.error.issues[0].message },
            { status: 400 }
          );
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

    const updateResult = await servicesCollection.updateOne(
      { _id: new ObjectId(id) }, // Match by ID
      { $set: updatedService }
    );

    if (updateResult.modifiedCount === 0) {
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

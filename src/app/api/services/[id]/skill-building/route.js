// filepath: /D:/Semester 5/Web Engineering/innovateher/src/app/api/skill-building/route.js
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect'; // Helper to connect to MongoDB
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

    if (!serviceId) {
      return NextResponse.json({ error: 'Service ID is required.' }, { status: 400 });
    }

    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    const service = await servicesCollection.findOne({ _id: new ObjectId(serviceId) });
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
    const { title, description, duration,category, imageUrl, difficulty, price, sellerId } = body;

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

    // Get the "courses" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }

    // Insert new course
    const newCourse = {
      title,
      description,
      duration,
      difficulty,
      category,
      imageUrl,
      price: parseFloat(price), // Ensure price is stored as a number
      seller: sellerId, // Reference to the seller (user ID)
      students: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await servicesCollection.insertOne(newCourse);
    if (!insertResult.acknowledged) {
      return NextResponse.json({ error: 'Failed to add course.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Skill-building course added successfully.', newCourse }, { status: 201 });
  } catch (error) {
    console.error('Error adding skill-building course:', error.message);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json(); // Parse the incoming request body
    const { id, title, description,duration, difficulty, imageUrl, category, price, sellerId } = body;

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

    // Get the "services" collection
    const servicesCollection = await getCollection('services');
    if (!servicesCollection) {
      return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    }
    // Update the service
    const updatedService = {
      title,
      description,
      category,
      difficulty,
      duration,
      imageUrl,
      price: parseFloat(price), // Ensure price is stored as a number
      seller: sellerId, // Reference to the seller (user ID)
      updatedAt: new Date(),
    };

    const updateResult = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
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
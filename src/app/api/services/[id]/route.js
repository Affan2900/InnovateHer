import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  const url = new URL(req.url);
  const userId = url.pathname.split('/').pop(); // Extract the user ID from the URL

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const servicesCollection = await getCollection('services'); // Get the "services" collection
  if (!servicesCollection) {
    return NextResponse.json({ error: 'Server error!' }, { status: 500 });
  }

  try {
    // Fetch all services
    const services = await servicesCollection.find({}).toArray();

    // Sort services: user-specific services first
    const sortedServices = services.sort((a, b) => {
      const isAUserService = a.userId === userId;
      const isBUserService = b.userId === userId;

      if (isAUserService && !isBUserService) return -1; // `a` comes before `b`
      if (!isAUserService && isBUserService) return 1; // `b` comes before `a`
      return 0; // No change in order
    });

    return NextResponse.json(sortedServices, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}


export async function POST(request, { params }) {
  const userId = params.id;
  const { serviceId } = await request.json(); // Extract serviceId from request body
  const servicesCollection = await getCollection('services');

  console.log('Received userId:', userId);
  console.log('Received serviceId:', serviceId);

  try {
    // Convert serviceId to ObjectId if necessary
    const objectId = new ObjectId(serviceId);

    // Update the service document to add the user to the customers array
    const result = await servicesCollection.updateOne(
      { _id: objectId },
      { $addToSet: { customers: userId } } // Use $addToSet to avoid duplicates
    );

    console.log('Update result:', result);

    if (result.modifiedCount === 0) {
      throw new Error('Failed to add user to customers array');
    }

    return NextResponse.json({ message: 'User added to customers array' }, { status: 200 });
  } catch (error) {
    console.error('Error updating service:', error.message);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

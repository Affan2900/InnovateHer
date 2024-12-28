import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect';

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

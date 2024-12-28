import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect'; // Replace with your database connection logic

export async function GET() {
  const servicesCollection = await getCollection('services'); // Fetch the "services" collection
  if (!servicesCollection) {
    return NextResponse.json({ error: 'Server error!' }, { status: 500 });
  }

  try {
    // Fetch all services, including seller and customers (populated)
    const services = await servicesCollection
      .find({})
      .toArray();

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
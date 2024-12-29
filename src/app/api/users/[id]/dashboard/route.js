// filepath: /D:/Semester 5/Web Engineering/innovateher/src/app/api/users/[id]/dashboard/route.js
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/connect'; // Ensure correct MongoDB setup

export async function GET(request, { params }) {
  const { id } = await params;
  const servicesCollection = await getCollection('services');

  console.log('Received userId:', id);

  try {
    // Fetch services offered by the user
    const servicesOffered = await servicesCollection.find({ seller: id }).toArray();
    console.log('Services offered:', servicesOffered);

    // Fetch services bought by the user
    const servicesBought = await servicesCollection.aggregate([
      {
          $match: {
              customers: id // Replace 'id' with the actual variable holding the customer ID
          }
      }
  ]).toArray();
  


    console.log('Services bought:', servicesBought);

    const response = {
      servicesOffered: servicesOffered.map((service) => ({
        id: service._id,
        title: service.title,
        description: service.description,
        price: service.price,
        category: service.category,
      })),
      servicesBought: servicesBought.map((bought) => ({
        id: bought._id,
        title: bought.title,
        description: bought.description,
        price: bought.price,
        category: bought.category,
        // status: bought.customers.find((customer) => customer === id)?.status,
      })),
    };

    console.log('Response:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
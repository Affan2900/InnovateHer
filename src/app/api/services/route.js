import connectMongo from "@/lib/connect";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectMongo();
    const services = await Service.find();
    return new Response(JSON.stringify(services), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongo();
    const serviceData = await request.json();
    const newService = new Service(serviceData);
    await newService.save();
    return new Response(JSON.stringify(newService), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

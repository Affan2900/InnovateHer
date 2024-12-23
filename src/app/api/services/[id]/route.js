import connectMongo from "@/lib/connect";
import Service from "@/models/Service";

export async function GET(request, { params }) {
  try {
    await connectMongo();
    const service = await Service.findById(params.id);
    if (!service) return new Response("Service not found", { status: 404 });

    return new Response(JSON.stringify(service), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongo();
    const updates = await request.json();
    const updatedService = await Service.findByIdAndUpdate(params.id, updates, { new: true });

    if (!updatedService) return new Response("Service not found", { status: 404 });
    return new Response(JSON.stringify(updatedService), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongo();
    const deletedService = await Service.findByIdAndDelete(params.id);

    if (!deletedService) return new Response("Service not found", { status: 404 });
    return new Response("Service deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

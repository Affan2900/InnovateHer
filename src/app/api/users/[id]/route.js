import connectMongo from "@/lib/db";
import User from "@/models/User";

export async function GET(request, { params }) {
  try {
    await connectMongo();
    const user = await User.findById(params.id);
    if (!user) return new Response("User not found", { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongo();
    const updates = await request.json();
    const user = await User.findByIdAndUpdate(params.id, updates, { new: true });

    if (!user) return new Response("User not found", { status: 404 });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongo();
    const user = await User.findByIdAndDelete(params.id);
    if (!user) return new Response("User not found", { status: 404 });

    return new Response("User deleted successfully", { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

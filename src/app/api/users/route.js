import connectMongo from "@/lib/connect";
import User from "@/models/User";

export async function GET() {
  try {
    await connectMongo();
    const users = await User.find(); // Fetch all users
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectMongo();
    const { name, email, password, roles } = await request.json();

    const newUser = new User({ name, email, password, roles });
    await newUser.save();

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

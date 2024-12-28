import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["marketplace", "skill-building", "mentorship", "networking"],
      required: true,
    }, // Category of the service
    price: { type: Number, required: true }, // Service price
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The seller of the service
    customers: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The buyer/registrant
        status: { type: String, enum: ["purchased", "registered"], required: true },
      },
    ], // List of customers who purchased/registered for the service
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);

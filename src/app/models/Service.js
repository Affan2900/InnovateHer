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
    price: { 
      type: Number, 
      required: true,
      min: [1, 'Price must be at least 1'],
      max: [10000, 'Price cannot exceed 10,000'],
    },// Service price
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The seller of the service
    customers: [
      {
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // The buyer/registrant
        status: { type: String, enum: ["purchased", "registered"], required: true },
      },
    ], // List of customers who purchased/registered for the service
    userCounts: {
      type: Map,
      of: Number,
      default: {},
    }, // Map to store the count of purchases for each user
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);

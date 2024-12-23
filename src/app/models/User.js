import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ["customer", "seller"], required: true }, // User roles
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }], // Services the user sells
    servicesBought: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        status: { type: String, enum: ["purchased", "registered"], required: true }, // Status of the service
      },
    ], // Services the user has purchased or registered for
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

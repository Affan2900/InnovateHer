import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique:true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ["buyer", "seller"]}, // User roles
    currentRole: { type: String, enum: ["buyer", "seller"], default: "buyer" }, // Current role
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

import mongoose from "mongoose";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], enum: ["buyer", "seller"] },
    currentRole: { type: String, enum: ["buyer", "seller"], default: "buyer" },
    servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    servicesBought: [
      {
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        status: { type: String, enum: ["purchased", "registered"], required: true },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add a method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);

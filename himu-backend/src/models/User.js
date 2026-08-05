import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, maxlength: 254 },
    password: {
      type: String,
      required: function requiredPassword() {
        return this.authProvider !== "google";
      },
      select: false,
    },
    phone: { type: String, default: "", maxlength: 20 },
    role: { type: String, enum: ["admin", "customer"], default: "customer" },
    active: { type: Boolean, default: true },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, sparse: true, unique: true, default: undefined },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.password || !this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);

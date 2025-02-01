import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: "" },
    password: { type: String, required: true },
    is_online: { type: String, default: "0" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

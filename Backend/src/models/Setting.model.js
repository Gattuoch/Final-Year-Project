import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, default: "global" },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", SettingSchema);

export default Setting;

const mongoose = require("mongoose");

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo_image: {
    type: String,
    default: null
  },
  banner_image: {
    type: String,
    default: null
  },
  address: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  email: {
    type: String
  },
  is_suspended: {
    type: Boolean,
    default: false
  },
  is_default: {
    type: Boolean,
    default: false
  },
  is_online: {
    type: String,
    enum: ["online", "offline"],
    default: "offline"
  },
  opens_at: {
    type: String
  },
  closes_at: {
    type: String
  },
  mobileno: {
    type: String
  },
  password: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model("Store", StoreSchema);

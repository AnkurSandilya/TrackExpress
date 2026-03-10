const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  location: String,
  status: String,
  time: String
});

const parcelSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true
  },
  senderName: String,
  receiverName: String,
  originCity: String,
  destinationCity: String,
  transitHubs: [String],
  currentLocation: String,
  status: String,
  expectedDeliveryDate: String,
  history: [historySchema]
});

module.exports = mongoose.model("Parcel", parcelSchema);

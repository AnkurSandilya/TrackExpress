const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

console.log("SERVER FILE LOADED");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/trackexpress")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Import Models
const User = require("./models/User");
const Parcel = require("./models/Parcel");

// Utility: Generate Random Tracking ID
function generateTrackingId() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return "TX" + num;
}

// Test Route
app.get("/", (req, res) => {
  res.send("TrackExpress Backend Running");
});


// ================= REGISTER =================
app.post("/signup", async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.json({ success: false, message: "All fields required" });
    }

    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ userId, password });
    await newUser.save();

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});


// ================= TRACK PARCEL =================
app.get("/track/:trackingId", async (req, res) => {
  try {
    const id = req.params.trackingId;
    const parcel = await Parcel.findOne({ trackingId: id });

    if (!parcel) {
      return res.json({ success: false, message: "Tracking ID not found" });
    }

    res.json({ success: true, parcel });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});


// ================= CREATE BOOKING =================
app.post("/booking/create", async (req, res) => {
  try {
    const { senderName, receiverName, originCity, destinationCity, weight } = req.body;

    if (!senderName || !receiverName || !originCity || !destinationCity || !weight) {
      return res.json({ success: false, message: "All fields required" });
    }

    const trackingId = generateTrackingId();

    const parcel = new Parcel({
      trackingId,
      senderName,
      receiverName,
      originCity,
      destinationCity,
      transitHubs: [],
      currentLocation: originCity,
      status: "Booked",
      expectedDeliveryDate: "",
      history: [
        {
          location: originCity,
          status: "Booked",
          time: new Date().toISOString().split("T")[0]
        }
      ]
    });

    await parcel.save();

    res.json({
      success: true,
      message: "Booking created successfully",
      trackingId
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});


// ================= CANCEL BOOKING =================
app.post("/booking/cancel", async (req, res) => {
  try {
    const { trackingId } = req.body;

    if (!trackingId) {
      return res.json({ success: false, message: "Tracking ID required" });
    }

    const parcel = await Parcel.findOne({ trackingId });

    if (!parcel) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // 🚫 Restrict deletion after dispatch
    if (parcel.status !== "Booked") {
      return res.json({
        success: false,
        message: "Cannot cancel booking after parcel is dispatched"
      });
    }

    await Parcel.deleteOne({ trackingId });

    res.json({ success: true, message: "Booking cancelled successfully" });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});



// ================= GET ALL BOOKINGS (ADDED) =================
app.get("/booking/all", async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ _id: -1 });

    res.json({
      success: true,
      parcels
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error"
    });
  }
});


// ================= ADMIN ADD PARCEL =================
app.post("/admin/add-parcel", async (req, res) => {
  try {
    const parcelData = req.body;

    if (!parcelData.trackingId) {
      return res.json({ success: false, message: "Tracking ID required" });
    }

    const existing = await Parcel.findOne({ trackingId: parcelData.trackingId });
    if (existing) {
      return res.json({ success: false, message: "Tracking ID already exists" });
    }

    const parcel = new Parcel(parcelData);
    await parcel.save();

    res.json({ success: true, message: "Parcel added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ================= UPDATE STATUS =================
app.post("/admin/update-status", async (req, res) => {
  try {
    const { trackingId, location, status, time } = req.body;

    const parcel = await Parcel.findOne({ trackingId });

    if (!parcel) {
      return res.json({ success: false, message: "Parcel not found" });
    }

    parcel.currentLocation = location;
    parcel.status = status;
    parcel.history.push({ location, status, time });

    await parcel.save();

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});


// ================= GET ALL PARCELS =================
app.get("/admin/parcels", async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ _id: -1 });

    res.json({
      success: true,
      parcels
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: "Server error"
    });
  }
});


// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

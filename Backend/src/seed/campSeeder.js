import dotenv from "dotenv";
import mongoose from "mongoose";
import Camp from "../models/CampHome.js";

dotenv.config();

const seedData = [
  {
    name: "Simien Mountain Retreat",
    location: "Simien Mountains National Park",
    rating: 4.9,
    reviews: 127,
    description: "Luxury camping with breathtaking mountain views",
    price: 85,
    amenities: ["WiFi", "Parking", "Restaurant"],
    badge: "Popular",
    statusColor: "bg-green-50",
    TextColor: "text-green-800",
    image: "/images/camp1.png"
  },
  {
    name: "Lake Tana Paradise",
    location: "Lake Tana, Bahir Dar",
    rating: 4.8,
    reviews: 89,
    description: "Peaceful lakeside camping with water activities",
    price: 65,
    amenities: ["Kayaking", "Fishing"],
    badge: "Available",
    statusColor: "bg-green-100",
    TextColor: "#97C93D",
    image: "/images/camp2.png"
  }
];

async function seed() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);

    console.log("Connected to MongoDB");
    await Camp.deleteMany({});
    await Camp.insertMany(seedData);

    console.log("Camp data seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

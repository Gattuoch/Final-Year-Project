import mongoose from 'mongoose';
import SystemLog from '../models/SystemLog.model.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seedLogs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
        
        // Clear existing logs to show "exactly" what user requested
        await SystemLog.deleteMany({});
        
        const logs = [
            { level: "info", service: "auth", user: "manager_456", message: "User logged in: manager_456", timestamp: new Date("2026-05-03T10:01:16") },
            { level: "error", service: "auth", user: "system", message: "Failed login attempt for user admin@example.com", details: "IP: 192.168.1.105, User-Agent: Mozilla/5.0", timestamp: new Date("2026-05-03T09:31:16") },
            { level: "warning", service: "api", user: "system", message: "Slow query detected on /api/bookings", details: "Duration: 450ms", timestamp: new Date("2026-05-03T08:01:16") },
            { level: "info", service: "booking", user: "user_123", message: "New booking created: BK-98765", timestamp: new Date("2026-05-03T05:01:16") },
            { level: "error", service: "database", user: "system", message: "Connection pool timeout", details: "Max connections reached (100)", timestamp: new Date("2026-05-02T22:01:16") },
            { level: "info", service: "system", user: "system", message: "System background tasks completed", details: "Cleanup of temp files", timestamp: new Date("2026-05-02T10:01:16") }
        ];
        
        await SystemLog.insertMany(logs);
        console.log("Logs seeded successfully with user provided data");
        
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

seedLogs();

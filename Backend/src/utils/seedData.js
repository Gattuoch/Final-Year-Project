import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SystemLog from '../models/SystemLog.model.js';
import LogAlert from '../models/LogAlert.model.js';
import Backup from '../models/Backup.model.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data (optional, but good for a fresh "yesterday" look)
        await SystemLog.deleteMany({});
        await LogAlert.deleteMany({});
        await Backup.deleteMany({});

        // Seed System Logs
        const logs = [
            { level: 'error', service: 'auth', message: 'Failed login attempt for user admin@example.com', details: 'IP: 192.168.1.105, User-Agent: Mozilla/5.0', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
            { level: 'warning', service: 'api', message: 'Slow query detected on /api/bookings', details: 'Duration: 450ms', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
            { level: 'info', service: 'booking', message: 'New booking created: BK-98765', user: 'user_123', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
            { level: 'error', service: 'database', message: 'Connection pool timeout', details: 'Max connections reached (100)', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) },
            { level: 'info', service: 'system', message: 'System background tasks completed', details: 'Cleanup of temp files', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            { level: 'info', service: 'auth', message: 'User logged in: manager_456', user: 'manager_456', timestamp: new Date() }
        ];
        await SystemLog.insertMany(logs);
        console.log("Seeded System Logs.");

        // Seed Log Alerts
        const alerts = [
            { name: 'High Error Rate', description: 'Triggers when more than 5 errors occur in 5 minutes', pattern: 'level:error', status: 'active' },
            { name: 'Database Connection Issues', description: 'Alerts on connection timeouts', pattern: 'Connection pool timeout', status: 'active' },
            { name: 'Suspicious Auth Activity', description: 'Monitor for multiple failed logins', pattern: 'Failed login attempt', status: 'inactive' }
        ];
        await LogAlert.insertMany(alerts);
        console.log("Seeded Log Alerts.");

        // Seed Backups
        const backups = [
            { backupId: 'BK-2026-05-02-FULL', type: 'full', size: '1.2 GB', status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
            { backupId: 'BK-2026-05-03-INC', type: 'incremental', size: '45 MB', status: 'success', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6) }
        ];
        await Backup.insertMany(backups);
        console.log("Seeded Backups.");

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedData();

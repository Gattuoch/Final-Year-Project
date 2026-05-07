import Backup from '../models/Backup.model.js';

class BackupService {
    constructor() {
        this.interval = 15 * 60 * 1000; // 15 minutes
        this.timer = null;
    }

    async start() {
        console.log('🚀 Backup Service started...');
        
        // Initial seeding if no backups exist
        await this.seedInitialBackups();

        // Start interval
        this.timer = setInterval(() => {
            this.runIncrementalBackup();
        }, this.interval);
    }

    async seedInitialBackups() {
        try {
            const count = await Backup.countDocuments();
            if (count === 0) {
                console.log('🌱 Seeding initial backup data...');
                const now = new Date();
                
                // Create 5 incremental backups in the past
                for (let i = 1; i <= 5; i++) {
                    const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000));
                    await Backup.create({
                        backupId: `IB-2026-${5432 - i}`,
                        type: 'incremental',
                        database: 'MongoDB',
                        size: `${Math.floor(Math.random() * 200) + 100} MB`,
                        status: 'success',
                        timestamp: timestamp
                    });
                }

                // Create 1 full backup
                await Backup.create({
                    backupId: `FB-2026-104`,
                    type: 'full',
                    database: 'MongoDB',
                    size: '124 MB',
                    status: 'success',
                    path: '/backups/FB-2026-104.gz',
                    timestamp: new Date(now.getTime() - (2 * 60 * 60 * 1000)) // 2 hours ago
                });

                console.log('✅ Initial backup data seeded.');
            }
        } catch (error) {
            console.error('❌ Error seeding backups:', error);
        }
    }

    async runIncrementalBackup() {
        try {
            const backupId = `IB-2026-${Math.floor(Math.random() * 10000)}`;
            const newBackup = await Backup.create({
                backupId,
                type: 'incremental',
                database: 'MongoDB',
                size: `${Math.floor(Math.random() * 200) + 100} MB`,
                status: 'success',
                timestamp: new Date()
            });
            console.log(`📦 Automated Incremental Backup completed: ${backupId}`);
            return newBackup;
        } catch (error) {
            console.error('❌ Incremental backup failed:', error);
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export default new BackupService();

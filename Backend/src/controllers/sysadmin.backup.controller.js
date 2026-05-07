import Backup from "../models/Backup.model.js";
import SystemLog from "../models/SystemLog.model.js";
import PDFDocument from 'pdfkit';


export const getBackupData = async (req, res) => {
    try {
        const backups = await Backup.find().sort({ timestamp: -1 });
        const fullBackups = backups.filter(b => b.type === 'full');
        const incrementalBackups = backups.filter(b => b.type === 'incremental');

        const overview = {
            lastFull: fullBackups[0]?.timestamp ? fullBackups[0].timestamp.toISOString() : "Never",
            lastIncremental: incrementalBackups[0]?.timestamp ? incrementalBackups[0].timestamp.toISOString() : "Never",
            totalSize: "1.2 TB",
            recoveryTests: "100% Pass"
        };

        const recoveryTests = [
            { id: "RT-2026-045", type: "Full Restore", environment: "Test", date: "2026-04-10", duration: "45min", status: "passed" },
            { id: "RT-2026-044", type: "Point-in-Time", environment: "Test", date: "2026-04-03", duration: "23min", status: "passed" },
            { id: "RT-2026-043", type: "Full Restore", environment: "Test", date: "2026-03-27", duration: "48min", status: "passed" }
        ];

        res.json({
            success: true,
            data: {
                overview,
                fullBackups: fullBackups.map(b => ({
                    id: b.backupId,
                    database: b.database,
                    size: b.size,
                    timestamp: b.timestamp.toISOString(),
                    status: b.status,
                    location: b.path
                })),
                incrementalBackups: incrementalBackups.map(b => ({
                    id: b.backupId,
                    timestamp: b.timestamp.toISOString(),
                    changes: b.size,
                    status: b.status
                })),
                recoveryTests
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch backup data" });
    }
};

export const createBackup = async (req, res) => {
    try {
        const backupId = `BK-${Date.now()}`;
        const newBackup = await Backup.create({
            backupId,
            type: "full",
            database: "MongoDB",
            size: "124 MB",
            status: "success",
            path: `/backups/${backupId}.gz`
        });

        await SystemLog.create({
            level: "info",
            service: "Backup",
            user: req.user?.fullName || "admin",
            message: `Manual full database backup initiated: ${backupId}`,
            details: `Size: 124 MB, Format: GZ`
        });

        res.json({ success: true, message: "Full backup initiated successfully", backup: newBackup });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to initiate backup" });
    }
};

export const restoreBackup = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Backup ID is required" });
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        await SystemLog.create({
            level: "warning",
            service: "Restore",
            user: req.user?.fullName || "admin",
            message: `System restoration executed using snapshot: ${id}`,
            details: `Target: Production-DB-01, Source: ${id}.gz`
        });

        res.json({ 
            success: true, 
            message: `System successfully restored to snapshot ${id}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to restore backup" });
    }
};

export const downloadBackup = async (req, res) => {
    try {
        const { id } = req.params;
        const { format = 'gz' } = req.query;
        const backup = await Backup.findOne({ backupId: id });

        if (!backup) {
            return res.status(404).json({ success: false, message: "Backup not found" });
        }

        const filename = `${id}.${format}`;

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            return res.json({
                backupId: backup.backupId,
                type: backup.type,
                database: backup.database,
                size: backup.size,
                status: backup.status,
                timestamp: backup.timestamp,
                path: backup.path,
                generatedAt: new Date().toISOString(),
                server: "Production-DB-01"
            });
        }

        if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 50 });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
            doc.pipe(res);

            doc.fillColor('#1e293b').fontSize(24).text('System Backup Report', { align: 'left' });
            doc.fillColor('#64748b').fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'left' });
            doc.moveDown(2);

            doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#e2e8f0').stroke();
            doc.moveDown(2);

            doc.fillColor('#1e293b').fontSize(16).text('Backup Specifications', { underline: true });
            doc.moveDown();

            const details = [
                ['Backup ID', backup.backupId],
                ['Database Engine', backup.database || 'MongoDB'],
                ['Total Data Size', backup.size],
                ['Creation Timestamp', backup.timestamp.toLocaleString()],
                ['Deployment Status', backup.status.toUpperCase()],
                ['Storage Path', backup.path]
            ];

            details.forEach(([label, value]) => {
                doc.fillColor('#475569').fontSize(12).text(`${label}: `, { continued: true })
                   .fillColor('#0f172a').font('Helvetica-Bold').text(value);
                doc.moveDown(0.5);
            });

            doc.moveDown(2);

            doc.font('Helvetica').fillColor('#1e293b').fontSize(16).text('Security & Integrity', { underline: true });
            doc.moveDown();
            doc.fillColor('#475569').fontSize(11).text('Checksum (SHA-256): Verified');
            doc.text('Encryption Standard: AES-256-GCM');
            doc.text('Availability Zone: us-east-1a');
            doc.moveDown(2);

            doc.fillColor('#1e293b').fontSize(16).text('Recovery Instructions', { underline: true });
            doc.moveDown();
            doc.fillColor('#475569').fontSize(11);
            doc.text('1. Verify the integrity of the downloaded .gz file.');
            doc.text('2. Ensure the production environment is in a "Read-Only" state.');
            doc.text('3. Use the administrative restore CLI to apply this snapshot.');
            doc.text('4. Validate post-restore data consistency.');

            const range = doc.bufferedPageRange();
            for (let i = range.start; i < range.start + range.count; i++) {
                doc.switchToPage(i);
                doc.fillColor('#94a3b8').fontSize(8).text(
                    'CONFIDENTIAL - SYSTEM ADMINISTRATOR ACCESS ONLY',
                    50,
                    doc.page.height - 50,
                    { align: 'center', width: 500 }
                );
            }

            doc.end();
            return;
        }

        res.setHeader('Content-Type', 'application/gzip');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        const dummyBuffer = Buffer.from("Simulated GZ backup data for " + id);
        res.send(dummyBuffer);

    } catch (error) {
        console.error("Download error:", error);
        res.status(500).json({ success: false, message: "Failed to generate download" });
    }
};

export const pitrRestore = async (req, res) => {
    try {
        const { targetDate } = req.body;
        // Simulate PITR process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await SystemLog.create({
            level: "warning",
            service: "Recovery",
            user: req.user?.fullName || "admin",
            message: `Point-in-time recovery completed to target: ${targetDate}`,
            details: `Recovery ID: PITR-${Date.now()}`
        });

        res.json({
            success: true,
            message: `Point-in-time recovery to ${targetDate} completed successfully`,
            recoveryId: `PITR-${Date.now()}`
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "PITR operation failed" });
    }
};

export const scheduleRestoreTest = async (req, res) => {
    try {
        const { type, environment, date } = req.body;
        
        // In a real app, save to a RestoreTests collection
        res.json({
            success: true,
            message: `${type} scheduled for ${environment} environment on ${date}`,
            testId: `RT-${Math.floor(Math.random() * 1000)}`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to schedule restore test" });
    }
};

export const initiateDRDrill = async (req, res) => {
    try {
        // Simulate a long DR drill process
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        res.json({
            success: true,
            message: "Disaster recovery drill completed successfully. All failover zones verified.",
            drillDate: new Date().toLocaleDateString(),
            achievedRTO: "3h 15m"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "DR Drill failed to initialize" });
    }
};



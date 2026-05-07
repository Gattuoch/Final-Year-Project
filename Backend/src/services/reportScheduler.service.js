import cron from 'node-cron';
import ReportSchedule from '../models/ReportSchedule.model.js';
import ReportTemplate from '../models/ReportTemplate.model.js';
import { sendMail } from './email.service.js';
import AuditLog from '../models/AuditLog.model.js';

class ReportScheduler {
    constructor() {
        this.jobs = new Map();
        this.init();
    }

    async init() {
        // Load all active schedules and schedule them
        const schedules = await ReportSchedule.find({ status: 'Active' });
        for (const schedule of schedules) {
            this.scheduleReport(schedule);
        }
    }

    scheduleReport(schedule) {
        const cronExpression = this.getCronExpression(schedule.frequency);
        if (!cronExpression) return;

        const job = cron.schedule(cronExpression, async () => {
            await this.sendScheduledReport(schedule);
        });

        this.jobs.set(schedule._id.toString(), job);
    }

    getCronExpression(frequency) {
        const now = new Date();
        switch (frequency) {
            case 'daily':
                return `0 ${now.getHours()} * * *`; // Every day at current hour
            case 'weekly':
                return `0 ${now.getHours()} * * ${now.getDay()}`; // Every week on current day
            case 'monthly':
                return `0 ${now.getHours()} ${now.getDate()} * *`; // Every month on current date
            default:
                return null;
        }
    }

    async sendScheduledReport(schedule) {
        try {
            const report = await ReportTemplate.findById(schedule.reportTemplateId);
            if (!report) return;

            // Update last run
            report.lastRun = new Date();
            await report.save();

            // Generate report content based on format
            let attachmentContent = "BINARY_PDF_DATA_MOCK";
            let contentType = "application/pdf";
            let filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;

            if (schedule.format === 'csv') {
                attachmentContent = "Date,Metric,Value\n2026-05-01,Uptime,99.9%\n2026-05-01,Errors,0.02%";
                contentType = "text/csv";
                filename += '.csv';
            } else if (schedule.format === 'excel') {
                attachmentContent = "BINARY_EXCEL_DATA_MOCK";
                contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                filename += '.xlsx';
            } else if (schedule.format === 'json') {
                attachmentContent = JSON.stringify({ name: report.name, data: { uptime: "99.9%", errors: "0.02%" } });
                contentType = "application/json";
                filename += '.json';
            } else {
                filename += '.pdf';
            }

            // Send to all recipients
            let sentCount = 0;
            let failedCount = 0;

            for (const recipient of schedule.recipients) {
                try {
                    await sendMail({
                        to: recipient,
                        subject: `Scheduled Report: ${report.name}`,
                        html: `<p>Please find the scheduled ${report.name} report attached.</p>`,
                        attachments: [{
                            filename,
                            content: attachmentContent,
                            contentType
                        }]
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send scheduled report to ${recipient}:`, err);
                    failedCount++;
                }
            }

            // Log the action
            await AuditLog.create({
                action: `Scheduled Report Sent: ${report.name}`,
                metadata: {
                    reportId: report._id,
                    recipients: schedule.recipients,
                    format: schedule.format,
                    sentCount,
                    failedCount
                }
            });

            // Calculate next run
            this.updateNextRun(schedule);

        } catch (error) {
            console.error('Error sending scheduled report:', error);
        }
    }

    updateNextRun(schedule) {
        const now = new Date();
        switch (schedule.frequency) {
            case 'daily':
                schedule.nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                break;
            case 'weekly':
                schedule.nextRun = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case 'monthly':
                const nextMonth = new Date(now);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                schedule.nextRun = nextMonth;
                break;
        }
        schedule.save();
    }

    addSchedule(schedule) {
        this.scheduleReport(schedule);
    }

    removeSchedule(scheduleId) {
        const job = this.jobs.get(scheduleId.toString());
        if (job) {
            job.destroy();
            this.jobs.delete(scheduleId.toString());
        }
    }

    updateSchedule(schedule) {
        this.removeSchedule(schedule._id);
        if (schedule.status === 'Active') {
            this.scheduleReport(schedule);
        }
    }
}

const reportScheduler = new ReportScheduler();

export default reportScheduler;
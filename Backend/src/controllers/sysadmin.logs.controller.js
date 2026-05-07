import SystemLog from "../models/SystemLog.model.js";
import LogAlert from "../models/LogAlert.model.js";

export const getLogs = async (req, res) => {
    try {
        const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(50);
        const alerts = await LogAlert.find();
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const errors = await SystemLog.countDocuments({ level: "error", timestamp: { $gte: last24h } });
        const warnings = await SystemLog.countDocuments({ level: "warning", timestamp: { $gte: last24h } });
        const info = await SystemLog.countDocuments({ level: "info", timestamp: { $gte: last24h } });
        res.json({
            success: true,
            data: {
                logEntries: logs.map(l => ({
                    id: l._id,
                    timestamp: l.timestamp.toLocaleString(),
                    level: l.level,
                    service: l.service,
                    user: l.user || "system",
                    message: l.message,
                    details: l.details
                })),
                overview: {
                    totalLogs: await SystemLog.countDocuments({ timestamp: { $gte: last24h } }),
                    errors,
                    warnings,
                    info
                },
                alerts: alerts.map(a => ({
                    id: a._id,
                    name: a.name,
                    description: a.description,
                    pattern: a.pattern,
                    status: a.status
                })),
                stack: [
                    { name: "Elasticsearch", status: "connected", latency: "12ms" },
                    { name: "Logstash", status: "connected", latency: "8ms" },
                    { name: "Redis Cache", status: "connected", latency: "2ms" }
                ]
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch logs data" });
    }
};

export const searchLogs = async (req, res) => {
    const { query, service, level, user, timeRange } = req.body;
    try {
        const filter = {};
        if (query) filter.message = { $regex: query, $options: 'i' };
        if (service && service !== 'all') filter.service = service;
        if (level && level !== 'all') filter.level = level;
        if (user) filter.user = user;
        if (timeRange) {
            const now = new Date();
            let dateFilter;
            if (timeRange === '1h') dateFilter = new Date(now - 60 * 60 * 1000);
            else if (timeRange === '6h') dateFilter = new Date(now - 6 * 60 * 60 * 1000);
            else if (timeRange === '24h') dateFilter = new Date(now - 24 * 60 * 60 * 1000);
            else if (timeRange === '7d') dateFilter = new Date(now - 7 * 24 * 60 * 60 * 1000);
            else if (timeRange === '30d') dateFilter = new Date(now - 30 * 24 * 60 * 60 * 1000);
            if (dateFilter) filter.timestamp = { $gte: dateFilter };
        }
        const logs = await SystemLog.find(filter).sort({ timestamp: -1 }).limit(100);
        res.json({
            success: true,
            data: {
                logEntries: logs.map(l => ({
                    id: l._id,
                    timestamp: l.timestamp.toLocaleString(),
                    level: l.level,
                    service: l.service,
                    user: l.user || "system",
                    message: l.message,
                    details: l.details
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to search logs" });
    }
};

export const manageAlert = async (req, res) => {
    const { id, name, description, pattern } = req.body;
    try {
        if (id) {
            const updated = await LogAlert.findByIdAndUpdate(id, { name, description, pattern }, { new: true });
            res.json({ success: true, message: "Alert pattern updated", alert: updated });
        } else {
            const created = await LogAlert.create({ name, description, pattern });
            res.json({ success: true, message: "New alert pattern configured", alert: created });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to manage alert pattern" });
    }
};

export const deleteAlert = async (req, res) => {
    const { id } = req.params;
    try {
        await LogAlert.findByIdAndDelete(id);
        res.json({ success: true, message: "Alert pattern deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete alert" });
    }
};

export const toggleAlertStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const alert = await LogAlert.findById(id);
        if (!alert) return res.status(404).json({ success: false, message: "Alert not found" });
        alert.status = alert.status === 'active' ? 'inactive' : 'active';
        await alert.save();
        res.json({ success: true, message: `Alert pattern is now ${alert.status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to toggle alert status" });
    }
};

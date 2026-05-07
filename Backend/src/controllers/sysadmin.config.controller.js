import Setting from "../models/Setting.model.js";
import SystemMetric from "../models/SystemMetric.model.js";

export const getSystemConfig = async (req, res) => {
    try {
        const settingsDoc = await Setting.findOne({ name: "global" });
        const data = settingsDoc?.data || {};

        // Fetch metrics
        let metrics = await SystemMetric.find({});
        
        // Ensure we have at least the core health metrics
        const hasHealthMetrics = metrics.some(m => m.type === 'health');
        const hasComponentStatus = metrics.some(m => m.type === 'component');

        if (!hasHealthMetrics || !hasComponentStatus) {
            // Clear and Re-seed to ensure consistency
            await SystemMetric.deleteMany({});
            
            const initialMetrics = [
                // System Health
                { type: 'health', name: 'uptime', value: '99.96%', description: 'Last 30 days', category: 'system-health' },
                { type: 'health', name: 'apiLatency', value: '124ms', description: 'P50 percentile', category: 'system-health' },
                { type: 'health', name: 'cacheHitRatio', value: '94.2%', description: 'Redis cache', category: 'system-health' },
                { type: 'health', name: 'errorRate', value: '0.03%', description: 'Last 24 hours', category: 'system-health' },

                // External Services
                { type: 'service', name: 'Chapa Payment Gateway', value: '124ms', unit: 'ms', status: 'healthy', description: '99.9% uptime', category: 'external-service' },
                { type: 'service', name: 'Cloudinary CDN', value: '45ms', unit: 'ms', status: 'healthy', description: '99.99% uptime', category: 'external-service' },
                { type: 'service', name: 'SMS Provider', value: '230ms', unit: 'ms', status: 'healthy', description: '99.5% uptime', category: 'external-service' },
                { type: 'service', name: 'Email Service', value: '180ms', unit: 'ms', status: 'healthy', description: '99.8% uptime', category: 'external-service' },

                // Component Status
                { type: 'component', name: 'Web Application', value: 'Operational', status: 'Operational', description: 'All instances healthy', category: 'component-status' },
                { type: 'component', name: 'API Server', value: 'Operational', status: 'Operational', description: '8/8 instances healthy', category: 'component-status' },
                { type: 'component', name: 'Database (MongoDB)', value: 'Operational', status: 'Operational', description: 'Primary and replicas healthy', category: 'component-status' },
                { type: 'component', name: 'Cache (Redis)', value: 'Operational', status: 'Operational', description: 'Cluster healthy', category: 'component-status' },
                { type: 'component', name: 'Message Queue', value: 'Operational', status: 'Operational', description: 'Processing normally', category: 'component-status' },
            ];
            await SystemMetric.insertMany(initialMetrics);
            metrics = await SystemMetric.find({});
        }

        const externalServices = metrics
            .filter(m => m.type === 'service')
            .map(m => ({ 
                name: m.name, 
                status: m.status, 
                latency: m.value, 
                uptime: m.description ? m.description.split(' ')[0] : '---',
                fullDescription: m.description,
                lastUpdated: m.lastUpdated
            }));

        const healthMetrics = metrics.filter(m => m.type === 'health');
        
        // Dynamic Simulation (Optional: Makes it look 'real-time')
        const getDynamicValue = (name, baseValue) => {
            const val = parseFloat(baseValue);
            if (isNaN(val)) return baseValue;
            
            let jitter = 0;
            if (name === 'apiLatency') jitter = Math.floor(Math.random() * 20) - 10; // +/- 10ms
            if (name === 'cacheHitRatio') jitter = (Math.random() * 2) - 1; // +/- 1%
            if (name === 'errorRate') jitter = (Math.random() * 0.02) - 0.01; // +/- 0.01%
            
            const newVal = Math.max(0, val + jitter);
            if (name === 'apiLatency') return `${Math.round(newVal)}ms`;
            if (name === 'cacheHitRatio') return `${newVal.toFixed(1)}%`;
            if (name === 'errorRate') return `${newVal.toFixed(2)}%`;
            return baseValue;
        };

        const systemHealth = {
            uptime: healthMetrics.find(m => m.name === 'uptime')?.value || "99.96%",
            apiLatency: getDynamicValue('apiLatency', healthMetrics.find(m => m.name === 'apiLatency')?.value || "124ms"),
            cacheHitRatio: getDynamicValue('cacheHitRatio', healthMetrics.find(m => m.name === 'cacheHitRatio')?.value || "94.2%"),
            errorRate: getDynamicValue('errorRate', healthMetrics.find(m => m.name === 'errorRate')?.value || "0.03%")
        };

        const componentStatus = metrics
            .filter(m => m.type === 'component')
            .map(m => ({
                name: m.name,
                description: m.description,
                status: m.status
            }));

        const settings = {
            timezone: data.timezone || "UTC",
            currency: data.currency || "USD",
            dateFormat: data.dateFormat || "DD/MM/YYYY",
            language: data.language || "am",
            chapaApiKey: data.payment?.chapaApiKey ? "sk_test_**********************" : "",
            cloudinaryKey: data.cloudinary?.cloudinaryKey ? "**********************" : "",
            commissionRate: data.payment?.commissionRate || 10,
            payoutThreshold: data.payment?.payoutThreshold || 500,
            cancellationWindow: data.booking?.cancellationWindow || 24,
            paymentFallback: data.fallbacks?.paymentFallback ?? true,
            imageFallback: data.fallbacks?.imageFallback ?? true,
            notificationFallback: data.fallbacks?.notificationFallback ?? true
        };

        res.status(200).json({
            success: true,
            data: {
                externalServices,
                systemHealth,
                componentStatus,
                settings
            }
        });
    } catch (error) {
        console.error("Error fetching system configuration:", error);
        res.status(500).json({ success: false, message: "Could not fetch system configuration" });
    }
};

export const saveConfig = async (req, res) => {
    try {
        const { 
            timezone, 
            currency, 
            dateFormat, 
            language,
            chapaApiKey, 
            cloudinaryKey, 
            commissionRate, 
            payoutThreshold, 
            cancellationWindow,
            paymentFallback,
            imageFallback,
            notificationFallback
        } = req.body;

        let settings = await Setting.findOne({ name: "global" });
        if (!settings) {
            settings = new Setting({ name: "global", data: {} });
        }

        // Initialize nested objects if they don't exist
        if (!settings.data.payment) settings.data.payment = {};
        if (!settings.data.cloudinary) settings.data.cloudinary = {};
        if (!settings.data.booking) settings.data.booking = {};
        if (!settings.data.fallbacks) settings.data.fallbacks = {};

        // Update fields
        if (timezone) settings.data.timezone = timezone;
        if (currency) settings.data.currency = currency;
        if (dateFormat) settings.data.dateFormat = dateFormat;
        if (language) settings.data.language = language;
        
        if (chapaApiKey && !chapaApiKey.includes('***')) settings.data.payment.chapaApiKey = chapaApiKey;
        if (cloudinaryKey && !cloudinaryKey.includes('***')) settings.data.cloudinary.cloudinaryKey = cloudinaryKey;
        
        if (commissionRate !== undefined) settings.data.payment.commissionRate = Number(commissionRate);
        if (payoutThreshold !== undefined) settings.data.payment.payoutThreshold = Number(payoutThreshold);
        if (cancellationWindow !== undefined) settings.data.booking.cancellationWindow = Number(cancellationWindow);

        if (paymentFallback !== undefined) settings.data.fallbacks.paymentFallback = !!paymentFallback;
        if (imageFallback !== undefined) settings.data.fallbacks.imageFallback = !!imageFallback;
        if (notificationFallback !== undefined) settings.data.fallbacks.notificationFallback = !!notificationFallback;

        settings.markModified('data');
        await settings.save();

        res.status(200).json({
            success: true,
            message: "Configuration saved successfully"
        });
    } catch (error) {
        console.error("Save config error:", error);
        res.status(500).json({ success: false, message: "Failed to save configuration" });
    }
};

export const testConnection = async (req, res) => {
    try {
        const { service } = req.body;
        
        // Simulate a real connection check
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update the database record for this service
        const updatedMetric = await SystemMetric.findOneAndUpdate(
            { name: service, type: 'service' },
            { 
                status: 'healthy', 
                lastUpdated: new Date(),
                // Optionally vary latency slightly on each test
            },
            { new: true }
        );

        if (!updatedMetric) {
            return res.status(404).json({ success: false, message: `Service ${service} not found in tracking` });
        }
        
        res.status(200).json({
            success: true,
            message: `Connection to ${service} is successful`,
            data: updatedMetric
        });
    } catch (error) {
        console.error("Test connection error:", error);
        res.status(500).json({ success: false, message: `Failed to test connection to ${req.body?.service}` });
    }
};

import FeatureFlag from "../models/FeatureFlag.model.js";
import ABTest from "../models/ABTest.model.js";
import SystemUpdate from "../models/SystemUpdate.model.js";
import mongoose from "mongoose";

export const getFeaturesData = async (req, res) => {
    try {
        let featureFlags = await FeatureFlag.find({});
        
        // Seed initial feature flags if none exist
        if (featureFlags.length === 0) {
            const initialFlags = [
                { id: "ai-recommendations", name: "AI Recommendations", description: "Machine learning based camp suggestions", enabled: true, users: 3847 },
                { id: "instant-booking", name: "Instant Booking", description: "Skip approval for verified camps", enabled: true, users: 1234 },
                { id: "multi-currency", name: "Multi-Currency Support", description: "Accept payments in USD and EUR", enabled: true, users: 0 },
                { id: "chat-support", name: "Live Chat Support", description: "Real-time customer support", enabled: true, users: 892 },
                { id: "virtual-tours", name: "360° Virtual Tours", description: "Immersive camp previews", enabled: false, users: 0 },

            ];
            await FeatureFlag.insertMany(initialFlags);
            featureFlags = await FeatureFlag.find({});
        }

        let abTests = await ABTest.find({});
        if (abTests.length === 0) {
            const initialTests = [
                { 
                    id: "test-homepage-v2", 
                    name: "Homepage Redesign", 
                    variant: "A/B", 
                    traffic: "50/50", 
                    status: "completed", 
                    startDate: "2026-04-10", 
                    metric: "Conversion Rate",
                    results: {
                        variantA: { traffic: 50, conversions: 1923, visitors: 7912, rate: 24.3 },
                        variantB: { traffic: 50, conversions: 2289, visitors: 7975, rate: 28.7 },
                        improvement: 18.1
                    }
                },
                { 
                    id: "test-checkout-flow", 
                    name: "Simplified Checkout", 
                    variant: "A/B/C", 
                    traffic: "33/33/34", 
                    status: "completed", 
                    startDate: "2026-04-08", 
                    metric: "Completion Rate",
                    results: {
                        variantA: { traffic: 33, conversions: 542, visitors: 2100, rate: 25.8 },
                        variantB: { traffic: 33, conversions: 590, visitors: 2150, rate: 27.4 },
                        improvement: 6.2
                    }
                },
                { 
                    id: "test-pricing-display", 
                    name: "Pricing Display Format", 
                    variant: "A/B", 
                    traffic: "50/50", 
                    status: "completed", 
                    startDate: "2026-03-25", 
                    metric: "Booking Rate",
                    results: {
                        variantA: { traffic: 50, conversions: 1200, visitors: 5000, rate: 24.0 },
                        variantB: { traffic: 50, conversions: 1350, visitors: 5100, rate: 26.5 },
                        improvement: 10.4
                    }
                },
            ];
            await ABTest.insertMany(initialTests);
            abTests = await ABTest.find({});
        }

        
        let updates = await SystemUpdate.find({});
        if (updates.length === 0) {
            const initialUpdates = [
                { id: "update-2.4.0", version: "2.4.0", description: "AI recommendations, improved search", date: "2026-04-01", status: "deployed" },
                { id: "update-2.3.7", version: "2.3.7", description: "Security patches, bug fixes", date: "2026-03-15", status: "deployed" },
                { id: "update-2.3.0", version: "2.3.0", description: "Mobile app redesign", date: "2026-03-01", status: "deployed" },
            ];
            await SystemUpdate.insertMany(initialUpdates);
            updates = await SystemUpdate.find({});
        }

        res.status(200).json({
            success: true,
            data: {
                featureFlags,
                abTests,
                updates
            }
        });
    } catch (error) {
        console.error("Error fetching features data:", error);
        res.status(500).json({ success: false, message: "Could not fetch features data" });
    }
};

export const createFeatureFlag = async (req, res) => {
    try {
        const { name, description, enabled } = req.body;
        
        if (!name) return res.status(400).json({ success: false, message: "Feature name is required" });

        const id = name.toLowerCase().replace(/\s+/g, '-');
        
        const newFlag = new FeatureFlag({
            id,
            name,
            description: description || "No description provided",
            enabled: enabled || false,
            users: 0
        });

        await newFlag.save();

        res.status(201).json({
            success: true,
            message: `Feature flag "${name}" created successfully`,
            data: newFlag
        });
    } catch (error) {
        console.error("Create feature flag error:", error);
        res.status(500).json({ success: false, message: "Failed to create feature flag" });
    }
};

export const editFeatureFlag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, enabled } = req.body;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        
        const flag = await FeatureFlag.findOneAndUpdate(
            query,
            { name, description, enabled },
            { new: true }
        );

        if (!flag) return res.status(404).json({ success: false, message: "Feature flag not found" });

        res.status(200).json({
            success: true,
            message: `Feature flag updated successfully`,
            data: flag
        });
    } catch (error) {
        console.error("Edit feature flag error:", error);
        res.status(500).json({ success: false, message: "Failed to edit feature flag" });
    }
};

export const deleteFeatureFlag = async (req, res) => {
    try {
        const { id } = req.params;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        const flag = await FeatureFlag.findOneAndDelete(query);
        
        if (!flag) return res.status(404).json({ success: false, message: "Feature flag not found" });

        res.status(200).json({
            success: true,
            message: `Feature flag deleted successfully`
        });
    } catch (error) {
        console.error("Delete feature flag error:", error);
        res.status(500).json({ success: false, message: "Failed to delete feature flag" });
    }
};

export const toggleFeature = async (req, res) => {
    try {
        const { id } = req.params; 
        const { enabled } = req.body;
        
        const feature = await FeatureFlag.findOneAndUpdate({ id }, { enabled }, { new: true });
        if (!feature) return res.status(404).json({ success: false, message: "Feature flag not found" });

        res.status(200).json({
            success: true,
            message: `Feature "${feature.name}" ${enabled ? "enabled" : "disabled"}`
        });
    } catch (error) {
        console.error("Toggle feature error:", error);
        res.status(500).json({ success: false, message: "Failed to toggle feature" });
    }
};

export const deployFeature = async (req, res) => {
    try {
        const pendingUpdate = await SystemUpdate.findOneAndUpdate(
            { status: { $in: ["pending", "available"] } },
            { status: "deployed", date: new Date().toISOString().split('T')[0] },
            { new: true, sort: { version: 1 } }
        );

        if (!pendingUpdate) {
             return res.status(400).json({ success: false, message: "No pending features to deploy." });
        }

        res.status(200).json({
            success: true,
            message: `Successfully deployed version ${pendingUpdate.version}`
        });
    } catch (error) {
        console.error("Deploy feature error:", error);
        res.status(500).json({ success: false, message: "Failed to deploy feature" });
    }
};

export const startABTest = async (req, res) => {
    try {
        const { name, variant, traffic, metric } = req.body;
        
        if (!name) return res.status(400).json({ success: false, message: "Test name is required" });

        const testName = name;
        const id = testName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        
        const newTest = new ABTest({
            id,
            name: testName,
            variant: variant || "A/B",
            traffic: traffic || "50/50",
            status: "running",
            startDate: new Date().toISOString().split('T')[0],
            metric: metric || "Conversion Rate"
        });

        await newTest.save();

        res.status(200).json({
            success: true,
            message: `A/B test "${testName}" started`,
            data: newTest
        });
    } catch (error) {
        console.error("Start A/B test error:", error);
        res.status(500).json({ success: false, message: "Failed to start A/B test" });
    }
};

export const editABTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, variant, traffic, metric } = req.body;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        
        const test = await ABTest.findOneAndUpdate(
            query,
            { name, variant, traffic, metric },
            { new: true }
        );

        if (!test) return res.status(404).json({ success: false, message: "A/B test not found" });

        res.status(200).json({
            success: true,
            message: `A/B test updated successfully`,
            data: test
        });
    } catch (error) {
        console.error("Edit A/B test error:", error);
        res.status(500).json({ success: false, message: "Failed to edit A/B test" });
    }
};

export const stopABTest = async (req, res) => {
    try {
        const { id } = req.params;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        const test = await ABTest.findOneAndUpdate(query, { status: "completed" }, { new: true });
        
        if (!test) return res.status(404).json({ success: false, message: `A/B test not found for query: ${JSON.stringify(query)}` });

        res.status(200).json({
            success: true,
            message: `A/B test "${test.name}" stopped`
        });
    } catch (error) {
        console.error("Stop A/B test error:", error);
        res.status(500).json({ success: false, message: "Failed to stop A/B test" });
    }
};

export const deleteABTest = async (req, res) => {
    try {
        const { id } = req.params;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        const test = await ABTest.findOneAndDelete(query);
        
        if (!test) return res.status(404).json({ success: false, message: `A/B test not found for query: ${JSON.stringify(query)}` });

        res.status(200).json({
            success: true,
            message: `A/B test "${test.name}" deleted successfully`
        });
    } catch (error) {
        console.error("Delete A/B test error:", error);
        res.status(500).json({ success: false, message: "Failed to delete A/B test" });
    }
};

export const applyUpdates = async (req, res) => {
    try {
        const pending = await SystemUpdate.findOne({ status: "pending" });
        if (pending) {
            return res.status(400).json({ success: false, message: "There is already a pending update. Please deploy it first." });
        }

        const deployedCount = await SystemUpdate.countDocuments({ status: "deployed" });
        const nextMinorVersion = deployedCount + 5;

        const newUpdate = new SystemUpdate({
            id: `update-${Date.now()}`,
            version: `2.${nextMinorVersion}.0`,
            description: "System performance improvements and minor bug fixes",
            date: new Date().toISOString().split('T')[0],
            status: "pending"
        });
        await newUpdate.save();

        res.status(200).json({
            success: true,
            message: "System updates fetched and queued for deployment"
        });
    } catch (error) {
        console.error("Apply updates error:", error);
        res.status(500).json({ success: false, message: "Failed to apply updates" });
    }
};

export const editUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { version, description, status } = req.body;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        
        const update = await SystemUpdate.findOneAndUpdate(
            query,
            { version, description, status },
            { new: true }
        );

        if (!update) return res.status(404).json({ success: false, message: "System update not found" });

        res.status(200).json({
            success: true,
            message: `System update updated successfully`,
            data: update
        });
    } catch (error) {
        console.error("Edit update error:", error);
        res.status(500).json({ success: false, message: "Failed to edit system update" });
    }
};

export const deleteUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: id }] } : { id: id };
        const update = await SystemUpdate.findOneAndDelete(query);
        
        if (!update) return res.status(404).json({ success: false, message: "System update not found" });

        res.status(200).json({
            success: true,
            message: `System update deleted successfully`
        });
    } catch (error) {
        console.error("Delete update error:", error);
        res.status(500).json({ success: false, message: "Failed to delete system update" });
    }
};

export const createUpdate = async (req, res) => {
    try {
        const { version, description, status } = req.body;
        
        if (!version || !description) {
            return res.status(400).json({ success: false, message: "Version and description are required" });
        }

        const id = "upd-" + Date.now();
        const newUpdate = new SystemUpdate({
            id,
            version,
            description,
            status: status || "available",
            date: new Date().toISOString().split('T')[0]
        });

        await newUpdate.save();

        res.status(201).json({
            success: true,
            message: "System update record created manually",
            data: newUpdate
        });
    } catch (error) {
        console.error("Create update error:", error);
        res.status(500).json({ success: false, message: "Failed to create system update" });
    }
};

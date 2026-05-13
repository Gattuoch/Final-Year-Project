import Setting from "../models/Setting.model.js";
import SecurityIncident from "../models/SecurityIncident.model.js";
import VulnerabilityScan from "../models/VulnerabilityScan.model.js";

// Helper to get or create setting
const getSetting = async (name, defaultData) => {
  let setting = await Setting.findOne({ name });
  if (!setting) {
    setting = await Setting.create({ name, data: defaultData });
  }
  return setting;
};

export const getSecurityData = async (req, res) => {
  try {
    const policySetting = await getSetting("password_policy", {
      mfaEnabled: true,
      minPasswordLength: 12,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true
    });

    const ipSetting = await getSetting("banned_ips", [
      { ip: "192.168.1.45", reason: "Multiple failed login attempts", blockedAt: "2026-04-14 08:32:15", status: "active" },
      { ip: "10.0.0.123", reason: "Suspicious activity pattern", blockedAt: "2026-04-13 14:22:41", status: "active" }
    ]);

    // Fetch Incidents
    let incidents = await SecurityIncident.find().sort({ timestamp: -1 });
    if (incidents.length === 0) {
      incidents = await SecurityIncident.insertMany([
        { incidentId: "SEC-2024-041", type: "Brute Force", severity: "high", user: "user@example.com", timestamp: "2026-04-15T03:15:32Z", status: "investigating" },
        { incidentId: "SEC-2024-040", type: "Unauthorized Access", severity: "critical", user: "N/A", timestamp: "2026-04-14T15:42:11Z", status: "resolved" },
        { incidentId: "SEC-2024-039", type: "Suspicious Login", severity: "medium", user: "manager@camp.et", timestamp: "2026-04-14T09:33:45Z", status: "resolved" },
      ]);
    }

    // Fetch Scans
    let scans = await VulnerabilityScan.find().sort({ date: -1 });
    if (scans.length === 0) {
      scans = await VulnerabilityScan.insertMany([
        { scanId: "SCAN-124", tool: "OWASP ZAP", date: "2026-04-10T00:00:00Z", findings: 3, severity: "medium", status: "completed" },
        { scanId: "SCAN-123", tool: "OWASP ZAP", date: "2026-04-03T00:00:00Z", findings: 5, severity: "high", status: "remediated" },
        { scanId: "SCAN-122", tool: "OWASP ZAP", date: "2026-03-27T00:00:00Z", findings: 2, severity: "low", status: "remediated" },
      ]);
    }

    const penetrationTestSetting = await getSetting("penetration_test", {
      lastTest: {
        conductor: "CyberSec Partners",
        date: "2026-03-15",
        status: "complete"
      },
      findings: {
        total: 8,
        remediated: 8,
        status: "Complete"
      }
    });

    console.log("Penetration Test Data from DB:", JSON.stringify(penetrationTestSetting.data, null, 2));

    res.json({
      policy: policySetting.data,
      blockedIPs: ipSetting.data,
      penetrationTestData: penetrationTestSetting.data,
      incidents: incidents.map(i => ({
        id: i.incidentId,
        _id: i._id,
        type: i.type,
        severity: i.severity,
        user: i.user,
        timestamp: i.timestamp,
        status: i.status
      })),
      scans: scans.map(s => ({
        id: s.scanId,
        _id: s._id,
        tool: s.tool,
        date: s.date,
        findings: s.findings,
        severity: s.severity,
        status: s.status
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load security data", error: error.message });
  }
};

export const updatePasswordPolicy = async (req, res) => {
  try {
    const updatedPolicy = req.body;
    const setting = await Setting.findOneAndUpdate(
      { name: "password_policy" },
      { data: updatedPolicy },
      { new: true, upsert: true }
    );
    res.json({ message: "Password policy updated successfully", policy: setting.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to update policy", error: error.message });
  }
};

export const resolveIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await SecurityIncident.findOneAndUpdate(
      { incidentId: id },
      { status: "resolved" },
      { new: true }
    );
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json({ message: "Incident marked as resolved", incident });
  } catch (error) {
    res.status(500).json({ message: "Failed to resolve incident", error: error.message });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await SecurityIncident.findOneAndDelete({ incidentId: id });
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json({ message: "Incident deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete incident", error: error.message });
  }
};

export const blockIP = async (req, res) => {
  try {
    const { ip, reason } = req.body;
    
    // Get or create the banned_ips setting
    let setting = await Setting.findOne({ name: "banned_ips" });
    if (!setting) {
      setting = await Setting.create({ name: "banned_ips", data: [] });
    }
    
    const ipList = setting.data || [];
    
    // Check if already blocked
    if (ipList.some(item => item.ip === ip)) {
      return res.status(400).json({ message: "This IP address is already blocked" });
    }

    if (!ip) return res.status(400).json({ message: "IP is required" });

    ipList.push({
      ip,
      reason: reason || "Admin manual block",
      blockedAt: new Date().toISOString(),
      status: "active"
    });

    // Reattach so Mongoose sees the modification to Mixed type array
    setting.data = ipList;
    setting.markModified("data");
    await setting.save();

    res.json({ message: `IP address ${ip} has been blocked`, blockedIPs: setting.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to block IP", error: error.message });
  }
};

export const unblockIP = async (req, res) => {
  try {
    const { ip } = req.body;
    let setting = await Setting.findOne({ name: "banned_ips" });
    if (!setting) {
      return res.status(404).json({ message: "No blocked IPs found" });
    }
    
    let ipList = setting.data || [];
    ipList = ipList.filter(b => b.ip !== ip);
    setting.data = ipList;
    setting.markModified("data");
    await setting.save();

    res.json({ message: `IP address ${ip} has been unblocked`, blockedIPs: setting.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to unblock IP", error: error.message });
  }
};

export const scheduleScan = async (req, res) => {
  try {
    const { tool, severity } = req.body;
    
    if (!tool) return res.status(400).json({ message: "Tool is required" });

    const newScan = await VulnerabilityScan.create({
      scanId: `SCAN-${Math.floor(100 + Math.random() * 900)}`,
      tool,
      severity: severity || "low",
      date: new Date(),
      status: "completed", // For now, we simulate immediate completion
      findings: Math.floor(Math.random() * 10)
    });

    res.status(201).json({ message: "Scan scheduled successfully", scan: newScan });
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule scan", error: error.message });
  }
};

export const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;
    const scan = await VulnerabilityScan.findOneAndDelete({ scanId: id });
    if (!scan) return res.status(404).json({ message: "Scan not found" });
    res.json({ message: "Scan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete scan", error: error.message });
  }
};

export const schedulePentest = async (req, res) => {
  try {
    const { conductor, date } = req.body;
    
    if (!conductor || !date) {
      return res.status(400).json({ message: "Conductor and date are required" });
    }

    const setting = await Setting.findOneAndUpdate(
      { name: "penetration_test" },
      { 
        data: {
          lastTest: {
            conductor,
            date,
            status: "scheduled"
          },
          findings: {
            total: 0,
            remediated: 0,
            status: "Pending"
          }
        }
      },
      { new: true, upsert: true }
    );

    res.json({ message: "Penetration test scheduled successfully", data: setting.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule penetration test", error: error.message });
  }
};

export const completePentest = async (req, res) => {
  try {
    const { total, remediated } = req.body;
    
    if (total === undefined || remediated === undefined) {
      return res.status(400).json({ message: "Total and remediated findings are required" });
    }

    const setting = await Setting.findOne({ name: "penetration_test" });
    if (!setting) return res.status(404).json({ message: "No scheduled test found" });

    const updatedData = {
      ...setting.data,
      lastTest: {
        ...setting.data.lastTest,
        status: "complete"
      },
      findings: {
        total: parseInt(total),
        remediated: parseInt(remediated),
        status: "Complete"
      }
    };

    setting.data = updatedData;
    setting.markModified("data");
    await setting.save();

    res.json({ message: "Penetration test finalized", data: setting.data });
  } catch (error) {
    res.status(500).json({ message: "Failed to complete penetration test", error: error.message });
  }
};

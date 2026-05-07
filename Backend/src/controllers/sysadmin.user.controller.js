import User from "../models/User.model.js";
import AuditLog from "../models/AuditLog.model.js";
import SystemLog from "../models/SystemLog.model.js";
import * as notificationService from "../services/notification.service.js";



// Get all campers with booking count
export const getCampers = async (req, res) => {
  try {
    const campers = await User.aggregate([
      { $match: { role: { $in: ["camper", "user"] } } },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "camperId",
          as: "bookings"
        }
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" }
        }
      },
      {
        $project: {
          passwordHash: 0,
          __v: 0,
          bookings: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(campers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all managers with booking count
export const getManagers = async (req, res) => {
  try {
    const managers = await User.aggregate([
      { $match: { role: { $in: ["manager", "camp_manager", "admin"] } } },
      {
        $project: {
          passwordHash: 0,
          __v: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(managers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Create User
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      fullName: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email,
      phone,
      role: role || 'camper',
      passwordHash: password,
      mustResetPassword: true,
      isActive: true,
      isVerified: true,
      isInternal: true,
    });



    await newUser.save();
    
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;
    
    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, banReason } = req.body;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "system_admin") {
      return res.status(400).json({ message: "Cannot modify System Administrator status" });
    }

    if (status === "suspended") {
      user.isActive = false;
      user.isBanned = false;
    } else if (status === "banned") {
      user.isActive = false;
      user.isBanned = true;
      user.metadata = { ...user.metadata, banReason };
    } else if (status === "active") {
      user.isActive = true;
      user.isBanned = false;
    }

    await user.save();

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: `USER_${status.toUpperCase()}`,
      targetCollection: "users",
      targetId: user._id,
      metadata: { email: user.email, banReason }
    });

    // Create System Log for Monitoring dashboard
    await SystemLog.create({
      level: status === "active" ? "info" : "warning",
      service: "UserManagement",
      user: req.user?.fullName || "admin",
      message: `User ${user.fullName} status updated to ${status}`,
      details: `Email: ${user.email}, Reason: ${banReason || 'Administrative change'}`
    });


    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendWarning = async (req, res) => {
  try {
    const { id } = req.params;
    const { warningMessage } = req.body;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send notification (this will create a DB record and send an email)
    await notificationService.sendEmailNotification({
      userId: user._id,
      to: user.email || "", // Fallback to empty if no email, but will still create DB note
      type: "warning",
      subject: "Administrative Message from Support",
      text: warningMessage, // Use clean text for the database/dashboard fallback
      html: `<p>Hello ${user.fullName || 'User'},</p>
             <p>You have received a message from the system administrator:</p>
             <blockquote style="border-left: 4px solid #facc15; padding-left: 1rem; margin: 1rem 0; font-style: italic;">
               "${warningMessage}"
             </blockquote>
             <p>Please log in to your dashboard to view more details.</p>`
    });

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: "USER_WARNING",
      targetCollection: "users",
      targetId: user._id,
      metadata: { email: user.email, message: warningMessage }
    });

    res.json({ message: "Warning sent and notification recorded" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Change user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "system_admin") {
      return res.status(400).json({ message: "Cannot modify System Administrator role" });
    }

    user.role = role;
    await user.save();
    res.json({ message: `User role updated to ${role}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user details
export const updateUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone } = req.body;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    if (req.body.kycStatus) {
      user.businessInfo = { ...user.businessInfo, status: req.body.kycStatus };
    }

    await user.save();

    res.json({ message: "User details updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get recent moderation logs
export const getModerationLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      action: { $in: ["USER_BANNED", "USER_SUSPENDED", "USER_WARNING", "USER_ACTIVE", "USER_DELETED"] }
    })
    .populate("actor", "fullName")
    .sort({ createdAt: -1 })
    .limit(10);
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  console.log("Delete User Request Received for ID:", req.params.id);
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "system_admin" || user.role === "super_admin") {
      return res.status(400).json({ message: "Cannot delete Administrator accounts" });
    }

    await User.findByIdAndDelete(id);

    // Create Audit Log
    await AuditLog.create({
      actor: req.user._id,
      action: "USER_DELETED",
      targetCollection: "users",
      targetId: id,
      metadata: { email: user.email, name: user.fullName }
    });

    // Create System Log for Monitoring dashboard
    await SystemLog.create({
      level: "error",
      service: "UserManagement",
      user: req.user?.fullName || "admin",
      message: `User account permanently deleted: ${user.fullName}`,
      details: `Email: ${user.email}, ID: ${id}`
    });


    res.json({ message: "User account permanently deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

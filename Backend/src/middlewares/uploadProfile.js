import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure directories exist to prevent errors
const folders = ["uploads/avatars", "uploads/covers"];
folders.forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder =
      file.fieldname === "profilePicture" ? "uploads/avatars" : "uploads/covers";
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const uploadProfile = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default uploadProfile;

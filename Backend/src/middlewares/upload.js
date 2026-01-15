import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure directories exist to prevent errors
const folders = ["uploads/govId", "uploads/businessLicense"];
folders.forEach(f => {
  if (!fs.existsSync(f)) fs.mkdirSync(f, { recursive: true });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder =
      file.fieldname === "license" ? "uploads/businessLicense" : "uploads/govId";
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;
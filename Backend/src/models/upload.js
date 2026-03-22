import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder =
      file.fieldname === "govId" ? "uploads/govId" : "uploads/businessLicense";
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export default upload;

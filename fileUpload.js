import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("public/upload/image");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to public/upload/image
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File Filter Configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/; // Allowed file types
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("please upload image type file!"), false);
  }
};

// Multer Upload Middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB size limit
});

export default upload;

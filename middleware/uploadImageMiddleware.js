import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads'); // Adjust the path as necessary
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Specify the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
  },
});

const upload = multer({ storage: storage });
export const uploadProductImages = upload.array('images', 10); // Adjust the maximum number of files if needed

import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save to /uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

export const upload = multer({ storage });
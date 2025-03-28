import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");  // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, '${Date.now()}-${file.originalname}');  // Generate a unique filename
    },
    });

    // file filter 
    const fileFilter = (req, file, cb) => {
        const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (allowedFileTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
        }
      };
    
      const upload = multer({ storage, fileFilter });
    
      export default upload;
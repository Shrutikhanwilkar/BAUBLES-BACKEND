import multer from "multer";
import { bucket } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
const upload = multer({ storage: multer.memoryStorage() });
const validateFile = (file, allowedTypes = null) => {
    // Default allowed types for media files
    const defaultAllowedTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        // Videos
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm',
        // Audio
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/webm', 'audio/wave'
    ];

    const allowedFileTypes = allowedTypes || defaultAllowedTypes;
    const maxSize = 100 * 1024 * 1024; // 100MB for video/audio files

    if (!allowedFileTypes.includes(file.mimetype)) {
        throw new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedFileTypes.join(', ')}`);
    }
    if (file.size > maxSize) {
        throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum allowed: ${maxSize / 1024 / 1024}MB`);
    }
};

const getFileExtension = (originalName) => {
    return originalName.substring(originalName.lastIndexOf('.'));
};
// Single file upload
export const uploadSingleToFirebase = (fieldName) => [
    upload.single(fieldName),
    async (req, res, next) => {
        try {
            
            if (!req.file) return next();

            const file = req.file;

            // Validate file
            validateFile(file);

            const fileName = `uploads/${fieldName}-${Date.now()}-${uuidv4()}${getFileExtension(file.originalname)}`;
            const fileRef = bucket.file(fileName);

            const stream = fileRef.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        originalName: file.originalname,
                        uploadedAt: new Date().toISOString()
                    }
                },
            });

            stream.on("error", (err) => {
                console.error("🔥 Firebase Upload Error:", err);
                return res.status(500).json({
                    success: false,
                    message: "File upload failed",
                    error: err.message
                });
            });

            stream.on("finish", async () => {
                try {
                    // Make the file public
                    await fileRef.makePublic();
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                    req.body[fieldName] = publicUrl;
                    next();
                } catch (err) {
                    console.error("🔥 Error making file public:", err);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to make file public"
                    });
                }
            });

            stream.end(file.buffer);
        } catch (err) {
            console.error("🔥 Firebase Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed"
            });
        }
    },
];

// Array upload
export const uploadArrayToFirebase = (fieldName, maxCount = 5) => [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
        try {
            if (!req.files || req.files.length === 0) return next();

            // Validate all files first
            for (const file of req.files) {
                validateFile(file);
            }

            const urls = [];
            const uploadPromises = req.files.map(async (file, index) => {
                const fileName = `uploads/${fieldName}-${Date.now()}-${index}-${uuidv4()}${getFileExtension(file.originalname)}`;
                const fileRef = bucket.file(fileName);

                await new Promise((resolve, reject) => {
                    const stream = fileRef.createWriteStream({
                        metadata: {
                            contentType: file.mimetype,
                            metadata: {
                                originalName: file.originalname,
                                uploadedAt: new Date().toISOString(),
                                index: index
                            }
                        }
                    });
                    stream.on("error", reject);
                    stream.on("finish", resolve);
                    stream.end(file.buffer);
                });

                await fileRef.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                return publicUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            req.body[fieldName] = uploadedUrls;
            next();
        } catch (err) {
            console.error("🔥 Firebase Upload Error:", err);
            return res.status(400).json({
                success: false,
                message: err.message || "File upload failed"
            });
        }
    },
];
export const removeFromFirebase = async (fileUrls) => {
    if (!fileUrls) return { success: true, deleted: 0, failed: 0 };

    const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
    let deleted = 0, failed = 0;

    const deletePromises = urls.map(async (url) => {
        try {
            const filePath = url.split(`https://storage.googleapis.com/${bucket.name}/`)[1];
            if (!filePath) {
                console.warn("⚠️ Invalid Firebase URL:", url);
                failed++;
                return;
            }

            const file = bucket.file(filePath);
            const [exists] = await file.exists();

            if (exists) {
                await file.delete();
                deleted++;
            } else {
                console.log("ℹ️ File doesn't exist:", filePath);
            }
        } catch (err) {
            failed++;
        }
    });

    await Promise.all(deletePromises);
    return { success: true, deleted, failed };
};

export const uploadMultipleToFirebase = (fields) => [
   
  upload.fields(fields),
  
  async (req, res, next) => {
    try {
      if (!req.files) return next();
      const uploadedUrls = {};

      // Process each field
      const fileUploadPromises = [];

      for (const fieldName of Object.keys(req.files)) {
        uploadedUrls[fieldName] = [];

        req.files[fieldName].forEach((file, index) => {
          validateFile(file);

          const fileName = `uploads/${fieldName}-${Date.now()}-${index}-${uuidv4()}${getFileExtension(
            file.originalname
          )}`;
          const fileRef = bucket.file(fileName);

          const promise = new Promise((resolve, reject) => {
            const stream = fileRef.createWriteStream({
              metadata: {
                contentType: file.mimetype,
                metadata: {
                  originalName: file.originalname,
                  uploadedAt: new Date().toISOString(),
                },
              },
            });

            stream.on("error", reject);

            stream.on("finish", async () => {
              await fileRef.makePublic();
              const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
              uploadedUrls[fieldName].push(publicUrl);
              resolve();
            });

            stream.end(file.buffer);
          });

          fileUploadPromises.push(promise);
        });
      }
      await Promise.all(fileUploadPromises);

      // Set into req.body
      for (const key of Object.keys(uploadedUrls)) {
        req.body[key] =
          uploadedUrls[key].length === 1
            ? uploadedUrls[key][0]
            : uploadedUrls[key];
      }
      next();
    } catch (err) {
      console.error("🔥 Firebase Upload Error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
  },
];

import multer from "multer";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase.js";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadSingleToFirebase = (fieldName) => {
    return [
        upload.single(fieldName),
        async (req, res, next) => {
            try {
                if (!req.file) return next();

                const file = req.file;
                const storageRef = ref(
                    storage,
                    `uploads/${fieldName}-${Date.now()}`
                );

                const snapshot = await uploadBytes(storageRef, file.buffer);
                const downloadURL = await getDownloadURL(snapshot.ref);

                req.body[fieldName] = downloadURL;
                next();
            } catch (err) {
                console.error("🔥 Firebase Upload Error:", err);
                res.status(500).json({ success: false, message: "File upload failed" });
            }
        },
    ];
};


 // Upload multiple files to Firebase and inject URLs into req.body[fieldName] as an array
 
export const uploadArrayToFirebase = (fieldName, maxCount = 5) => {
    return [
        upload.array(fieldName, maxCount),
        async (req, res, next) => {
            try {
                if (!req.files || req.files.length === 0) return next();

                const urls = [];
                for (const file of req.files) {
                    const storageRef = ref(
                        storage,
                        `uploads/${fieldName}-${Date.now()}`
                    );

                    const snapshot = await uploadBytes(storageRef, file.buffer);
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    urls.push(downloadURL);
                }

                req.body[fieldName] = urls;
                next();
            } catch (err) {
                console.error("🔥 Firebase Upload Error:", err);
                res.status(500).json({ success: false, message: "File upload failed" });
            }
        },
    ];
};
//remove file
export const removeFromFirebase = async (fileUrls) => {
    try {
        if (!fileUrls) return;

        const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];

        for (const url of urls) {
            try {
                const filePath = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
                const fileRef = ref(storage, filePath);
                await deleteObject(fileRef);
                console.log("🗑️ Deleted from Firebase:", filePath);
            } catch (err) {
                console.error("⚠️ Failed to delete file:", url, err.message);
            }
        }
    } catch (err) {
        console.error("🔥 removeFromFirebase error:", err.message);
    }
  };
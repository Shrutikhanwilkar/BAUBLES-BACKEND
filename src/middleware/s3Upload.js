import multer from "multer";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

const upload = multer({ storage: multer.memoryStorage() });

const validateFile = (file, allowedTypes = null) => {
  const defaultAllowedTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Videos
    "video/mp4",
    "video/mpeg",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    // Audio
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/aac",
    // PDF
    "application/pdf",
  ];

  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!(allowedTypes || defaultAllowedTypes).includes(file.mimetype)) {
    throw new Error(`Invalid file type: ${file.mimetype}`);
  }

  if (file.size > maxSize) {
    throw new Error("File size exceeds 100MB");
  }
};

const getFileExtension = (name) => name.slice(name.lastIndexOf("."));

const compressImage = async (file) => {
  return sharp(file.buffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 70 })
    .toBuffer();
};

const getPublicUrl = (key) =>
  `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;


export const uploadSingleToS3 = (fieldName) => [
  upload.single(fieldName),
  async (req, res, next) => {
    try {
      if (!req.file) return next();

      const file = req.file;
      validateFile(file);

      const isImage = file.mimetype.startsWith("image");
      const buffer = isImage ? await compressImage(file) : file.buffer;

      const key = `uploads/${fieldName}-${Date.now()}-${uuidv4()}${getFileExtension(
        file.originalname
      )}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET,
          Key: key,
          Body: buffer,
          ContentType: isImage ? "image/jpeg" : file.mimetype,
        })
      );

      req.body[fieldName] = getPublicUrl(key);
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
  },
];

export const uploadArrayToS3 = (fieldName, maxCount = 5) => [
  upload.array(fieldName, maxCount),
  async (req, res, next) => {
    try {
      if (!req.files?.length) return next();

      const urls = await Promise.all(
        req.files.map(async (file, index) => {
          validateFile(file);

          const isImage = file.mimetype.startsWith("image");
          const buffer = isImage ? await compressImage(file) : file.buffer;

          const key = `uploads/${fieldName}-${Date.now()}-${index}-${uuidv4()}${getFileExtension(
            file.originalname
          )}`;

          await s3.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_BUCKET,
              Key: key,
              Body: buffer,
              ContentType: isImage ? "image/jpeg" : file.mimetype,
            })
          );

          return getPublicUrl(key);
        })
      );

      req.body[fieldName] = urls;
      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
  },
];

export const uploadMultipleToS3 = (fields) => [
  upload.fields(fields),
  async (req, res, next) => {
    try {
      if (!req.files) return next();

      const uploadedUrls = {};

      await Promise.all(
        Object.entries(req.files).flatMap(([fieldName, files]) =>
          files.map(async (file, index) => {
            validateFile(file);

            const isImage = file.mimetype.startsWith("image");
            const buffer = isImage ? await compressImage(file) : file.buffer;

            const key = `uploads/${fieldName}-${Date.now()}-${index}-${uuidv4()}${getFileExtension(
              file.originalname
            )}`;

            await s3.send(
              new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: key,
                Body: buffer,
                ContentType: isImage ? "image/jpeg" : file.mimetype,
              })
            );

            uploadedUrls[fieldName] ??= [];
            uploadedUrls[fieldName].push(getPublicUrl(key));
          })
        )
      );

      Object.keys(uploadedUrls).forEach(
        (k) =>
          (req.body[k] =
            uploadedUrls[k].length === 1 ? uploadedUrls[k][0] : uploadedUrls[k])
      );

      next();
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
  },
];

export const removeFromS3 = async (fileUrls) => {
  if (!fileUrls) return { success: true, deleted: 0, failed: 0 };

  const urls = Array.isArray(fileUrls) ? fileUrls : [fileUrls];
  let deleted = 0,
    failed = 0;

  await Promise.all(
    urls.map(async (url) => {
      try {
        const key = url.split(".amazonaws.com/")[1];
        if (!key) return failed++;

        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET,
            Key: key,
          })
        );
        deleted++;
      } catch {
        failed++;
      }
    })
  );

  return { success: true, deleted, failed };
};

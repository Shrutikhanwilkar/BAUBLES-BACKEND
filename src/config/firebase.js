import admin from "firebase-admin";
import dotenv from 'dotenv';
dotenv.config();
import serviceAccount from "./baubles-d8d6c-firebase-adminsdk-fbsvc-4338469903.json" with { type: "json" };
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const bucket = admin.storage().bucket();

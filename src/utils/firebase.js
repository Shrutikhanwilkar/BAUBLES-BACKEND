import admin from "firebase-admin";

let serviceAccount;

if (!admin.apps.length) {
  // Only run this when Firebase is not initialized
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Fix for escaped `\n` in private_key from .env
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

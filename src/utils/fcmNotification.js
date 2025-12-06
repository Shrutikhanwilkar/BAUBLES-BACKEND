import admin from "./firebase.js";
import notificationModel from "../models/notification.model.js";
import authModel from "../models/auth.model.js";
import { Role } from "./constants.js";
export const sendPushNotification = async (
  userId,
  token,
  title,
  body,
  data = {}
) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: {
      ...data,
    },
  };
  try {
    const response = await admin.messaging().send(message);
    await notificationModel.create({
      user: userId,
      title,
      body,
      data: data,
      deviceToken: token,
      status: "sent",
    });
    return response;
  } catch (error) {
    await notificationModel.create({
      user: userId,
      title,
      body,
      data: data,
      deviceToken: token,
      status: "failed",
    });
    throw error;
  }
};

export const sendBulkPushNotification = async (title, body, data = {}) => {
  try {
    const users = await authModel.find({
      deviceToken: { $exists: true, $ne: null },
      role: Role.USER,
    });

    if (!users.length) {
      return;
    }
    const sendPromises = users.map((user) =>
      sendPushNotification(user._id, user.deviceToken, title, body, data)
    );

    const results = await Promise.allSettled(sendPromises);
    return results;
  } catch (error) {
    throw error;
  }
};

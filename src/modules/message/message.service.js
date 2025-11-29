import Message from "../../models/message.model.js";
import Music from "../../models/music.model.js";
import AppError from "../../utils/appError.js";
import Children from "../../models/children.model.js";
import mongoose from "mongoose";
import HTTPStatusCode from "../../utils/httpStatusCode.js";
import authModel from "../../models/auth.model.js";
import StatusCategory from "../../models/statusCategory.model.js";
import { sendPushNotification } from "../../utils/fcmNotification.js";
class MessageService {
  // Send a message to a child for a given status category
  static async sendMessage(userId, childId, statusCategoryId) {
    // Validate child
    const child = await Children.findById(childId);
    if (!child) {
      throw new AppError({
        status: false,
        message: "Child not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    // Pick a random music for this category
    const musics = await Music.find({ statusCategory: statusCategoryId });
    if (!musics.length) {
      throw new AppError({
        status: false,
        message: "No music found for this status category",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }
    const randomMusic = musics[Math.floor(Math.random() * musics.length)];

    // Create message
    const message = await Message.create({
      userId,
      childId,
      statusCategoryId,
      musicId: randomMusic._id,
    });
    //notiifcation
    let parentId = await authModel
      .findOne({ _id: userId })
      .select("deviceToken");
    if (parentId?.deviceToken) {
      const statusCategory = await StatusCategory.findById(
        statusCategoryId
      ).lean();
       console.log(statusCategory);
      // Get notification message based on color
      const notificationBody = getStatusNotificationMessage(
        child.firstName,
        statusCategory.colourName
      );
      console.log(notificationBody,"---body")
      await sendPushNotification(
        userId,
        parentId.deviceToken,
        "Behaviour Status Change",
        notificationBody,
        {
          childId: childId.toString(),
          status: statusCategory.color,
          type: "BEHAVIOUR_STATUS",
        }
      );
    }
    return;
  }
  // List all messages for a child
  static async listMessages(userId, { page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "children",
          localField: "childId",
          foreignField: "_id",
          as: "child",
        },
      },
      { $unwind: { path: "$child", preserveNullAndEmptyArrays: true } }, // // Step 3: Join with status category
      {
        $lookup: {
          from: "statuscategories",
          localField: "statusCategoryId",
          foreignField: "_id",
          as: "statusCategory",
        },
      },
      {
        $unwind: { path: "$statusCategory", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "musics",
          localField: "musicId",
          foreignField: "_id",
          as: "music",
        },
      },
      { $unwind: { path: "$music", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          "child._id": 1,
          "child.firstName": 1,
          "child.avatar": 1,
          "statusCategory._id": 1,
          "statusCategory.name": 1,
          "statusCategory.color": 1,
          "music._id": 1,
          "music.title": 1,
          "music.musicFile": 1,
          "music.duration": 1,
        },
      },
    ];

    const messages = await Message.aggregate(pipeline);
    // Count total
    const totalMessages = await Message.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
    });

    return {
      page,
      limit,
      total: totalMessages,
      data: messages,
    };
  }
  static async listMusicLibrary({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "statuscategories",
          localField: "statusCategory",
          foreignField: "_id",
          as: "statusCategory",
        },
      },
      { $unwind: "$statusCategory" },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          musicFile: 1,
          createdAt: 1,
          "statusCategory._id": 1,
          "statusCategory.name": 1,
          "statusCategory.color": 1,
        },
      },
      { $sort: { "statusCategory._id": 1, createdAt: -1 } },

      // 👇 Pagination with facet
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Music.aggregate(pipeline);

    return {
      page,
      limit,
      total: result[0]?.totalCount[0]?.count || 0,
      data: result[0]?.data || [],
    };
  }
}
const getStatusNotificationMessage = (childName, color) => {
  const messages = {
    green: `${childName} is on the Nice List. Tap to review`,
    amber: `${childName} is at risk of the Naughty List. Tap to review`,
    red: `${childName} is on the Naughty List. Tap to review`,
    yellow: `${childName} is heading back to the Nice List. Tap to review`,
  };
  return messages[color.toLowerCase()] || "Tap to review";
};
export default MessageService;

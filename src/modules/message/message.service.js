import Message from "../../models/message.model.js"
import AppError from "../../utils/appError.js";
import Music from "../../models/music.model.js";
import Children from "../../models/children.model.js";
import mongoose from "mongoose";
class MessageService {

    // Send a message to a child for a given status category
    static async sendMessage(userId, childId, statusCategoryId) {
        // Validate child
        const child = await Children.findById(childId);
        if (!child) {
            throw new AppError({
                status: false,
                message: "Child not found",
                httpStatus: httpStatus.NOT_FOUND,
            });
        }

        // Pick a random music for this category
        const musics = await Music.find({ statusCategory: statusCategoryId });
        if (!musics.length) {
            throw new AppError({
                status: false,
                message: "No music found for this status category",
                httpStatus: httpStatus.NOT_FOUND,
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
        return null
        // Populate and return
        // return await Message.findById(message._id)
        //     .populate("statusCategoryId", "name color")
        //     .populate("musicId", "title musicFile")
        //     .lean();
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
            { $unwind: { path: "$child", preserveNullAndEmptyArrays: true } },  // // Step 3: Join with status category
            {
                $lookup: {
                    from: "statuscategories",
                    localField: "statusCategoryId",
                    foreignField: "_id",
                    as: "statusCategory",
                },
            },
            { $unwind: { path: "$statusCategory", preserveNullAndEmptyArrays: true } },
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

    // List children for a parent with last sent status category
    static async listChildrenWithLastMessage(parentId) {
        const children = await Children.find({ parentId }).lean();

        const result = await Promise.all(children.map(async (child) => {
            const lastMessage = await Message.findOne({ childId: child._id })
                .sort({ createdAt: -1 })
                .populate("statusCategoryId", "name color")
                .lean();

            return {
                ...child,
                lastStatusCategory: lastMessage ? lastMessage.statusCategoryId : null
            };
        }));

        return result;
    }
}

export default MessageService;

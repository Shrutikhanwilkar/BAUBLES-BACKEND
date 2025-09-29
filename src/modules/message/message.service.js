import Message from "../models/Message.model.js";
import Music from "../models/music.model.js";
import Children from "../models/children.model.js";
import AppError from "../../../utils/appError.js";
import httpStatus from "http-status";

class MessageService {

    // Send a message to a child for a given status category
    static async sendMessage(childId, statusCategoryId) {
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
            childId,
            statusCategoryId,
            musicId: randomMusic._id,
        });

        // Populate and return
        return await Message.findById(message._id)
            .populate("statusCategoryId", "name color")
            .populate("musicId", "title musicFile")
            .lean();
    }

    // List all messages for a child
    static async listMessages(childId) {
        return await Message.find({ childId })
            .populate("statusCategoryId", "name color")
            .populate("musicId", "title musicFile")
            .sort({ createdAt: -1 })
            .lean();
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


import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import { removeFromFirebase } from "../../../middleware/upload.js";
import AppError from "../../../utils/appError.js";
import audioPlaybackModel from "../../../models/audioPlayback.model.js";
export default class AudioPlayBackService {
  static async addAudioPlayBack(payload) {
    try {
      const newVideo = await audioPlaybackModel.create(payload);

      return newVideo;
    } catch (err) {
      throw new AppError({
        message: "Failed to upload audio playback",
        httpStatus: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        details: err.message,
      });
    }
  }

  static async getAllAudioPlayBack() {
    return audioPlaybackModel.find({isDashboard:false}).sort({ createdAt: -1 });
  }

  static async updateAudioPlayBack(id, payload) {
    const updated = await audioPlaybackModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!updated) {
      throw new AppError({
        message: "Data not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    return updated;
  }

  static async deleteAudioPlayBack(id) {
    const video = await audioPlaybackModel.findById(id);

    if (!video) {
      throw new AppError({
        message: "Data not found",
        httpStatus: HTTPStatusCode.NOT_FOUND,
      });
    }

    await audioPlaybackModel.deleteOne({ _id: id });

    // remove video file from firebase storage
    await removeFromFirebase(video.videoFile);
    await removeFromFirebase(video.thumbnail);
    return;
  }
}


import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import AppError from "../../../utils/appError.js";
import audioPlaybackModel from "../../../models/audioPlayback.model.js";
import { removeFromS3 } from "../../../middleware/s3Upload.js";
export default class AudioPlayBackService {
  static async addAudioPlayBack(payload) {
    try {
       if (payload.default) {
         await audioPlaybackModel.updateMany({}, { default: false });
       }
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
    if(payload.default){
      await audioPlaybackModel.updateMany({},{default:false})
    }
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
    await removeFromS3(video.videoFile);
    await removeFromS3(video.thumbnail);
    return;
  }
}

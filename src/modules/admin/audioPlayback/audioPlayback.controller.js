import { sendSuccess } from "../../../utils/responseHelper.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import AudioPlayBackService from "./audioPlayback.service.js";
export default class AudioPlayBackController {
  static addAudioPlayBack = asyncHandler(async (req, res) => {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      status: req.body.status,
      default: req.body.default,
      duration: req.body.duration,
      videoFile: req.body.videoFile,
      thumbnail: req.body.thumbnail,
    };

    const data = await AudioPlayBackService.addAudioPlayBack(payload);

    return sendSuccess(
      res,
      data,
      "Audio Playback uploaded successfully",
      HTTPStatusCode.OK
    );
  });

  // GET ALL
  static getAllAudioPlayBack = asyncHandler(async (req, res) => {
    const videos = await AudioPlayBackService.getAllAudioPlayBack();

    return sendSuccess(
      res,
      videos,
      "All audio playbacks fetched successfully",
      HTTPStatusCode.OK
    );
  });

  static updateAudioPlayBack = asyncHandler(async (req, res) => {
    const updated = await AudioPlayBackService.updateAudioPlayBack(
      req.params.id,
      req.body
    );

    return sendSuccess(
      res,
      updated,
      "Audio playbacks updated successfully",
      HTTPStatusCode.OK
    );
  });

  // DELETE
  static deleteAudioPlayBack = asyncHandler(async (req, res) => {
    await AudioPlayBackService.deleteAudioPlayBack(req.params.id);

    return sendSuccess(
      res,
      null,
      "Audio playbacks deleted successfully",
      HTTPStatusCode.OK
    );
  });
}

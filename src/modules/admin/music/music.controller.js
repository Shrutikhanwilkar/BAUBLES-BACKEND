import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import MusicService from "./music.service.js";

export default class MusicController {
    static addMusic = asyncHandler(async (req, res) => {

        const data = await MusicService.addMusic(req.body);
        return sendSuccess(res, data, "Music added successfully", httpStatus.CREATED);
    });

    static updateMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.updateMusic(musicId, req.body);
        return sendSuccess(res, data, "Music updated successfully", httpStatus.OK);
    });

    static listMusic = asyncHandler(async (req, res) => {
        const data = await MusicService.listMusic(req.query);
        return sendSuccess(res, data, "Music fetched successfully", httpStatus.OK);
    });

    static getMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.getMusic(musicId);
        return sendSuccess(res, data, "Music fetched successfully", httpStatus.OK);
    });

    static deleteMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.deleteMusic(musicId);
        return sendSuccess(res, data, "Music deleted successfully", httpStatus.OK);
    });
}

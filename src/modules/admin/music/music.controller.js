import httpStatus from "http-status";
import asyncHandler from "../../../utils/asyncHandler.js";
import { sendSuccess } from "../../../utils/responseHelper.js";
import MusicService from "./music.service.js";
import HTTPStatusCode from "../../../utils/httpStatusCode.js";
export default class MusicController {
    static addMusic = asyncHandler(async (req, res) => {

        const data = await MusicService.addMusic(req.body);
        return sendSuccess(res, data, "Music added successfully", HTTPStatusCode.CREATED);
    });

    static updateMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.updateMusic(musicId, req.body);
        return sendSuccess(res, data, "Music updated successfully", HTTPStatusCode.OK);
    });

    static listMusic = asyncHandler(async (req, res) => {
        const data = await MusicService.listMusic(req.query);
        return sendSuccess(res, data, "Music fetched successfully", HTTPStatusCode.OK);
    });

    static getMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.getMusic(musicId);
        return sendSuccess(res, data, "Music fetched successfully", HTTPStatusCode.OK);
    });

    static deleteMusic = asyncHandler(async (req, res) => {
        const { musicId } = req.params;
        const data = await MusicService.deleteMusic(musicId);
        return sendSuccess(res, data, "Music deleted successfully", HTTPStatusCode.OK);
    });
}

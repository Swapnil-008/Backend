import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if (!name || !description)
    {
        throw new ApiError(400, "Name and description are required");
    }
    const playlist = new Playlist({
        name,
        description,
        owner: req.user._id
    });
    await playlist.save();
    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"));
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if (!isValidObjectId(userId))
    {
        throw new ApiError(400, "Invalid User ID");
    }
    const playlists = await Playlist.find({owner: userId})
    .populate('videos', 'title thumbnail');
    if (!playlists.length)
    {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No playlists found for this user"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if (!isValidObjectId(playlistId))
    {
        throw new ApiError(400, "Invalid Playlist ID");
    }
    const playlist = await Playlist.findById(playlistId)
        .populate('videos', 'title thumbnail')
        .populate('owner', 'username avatar');

    if (!playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    //TODO: add video to playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Playlist or Video ID");
    }
    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    // Check if video already exists in the playlist
    if (playlist.videos.includes(videoId))
    {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Video already exists in this playlist"));
    }
    const video = await Video.findById(videoId);
    // Check if video exists
    if (!video)
    {
        throw new ApiError(404, "Video not found");
    }
    // Add video to playlist
    playlist.videos.push(videoId);
    // Save the updated playlist
    await playlist.save();
    // Return the updated playlist
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Playlist or Video ID");
    }
    // Check if playlist exists
    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    // Check if video exists in the playlist
    if (!playlist.videos.includes(videoId))
    {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Video does not exist in this playlist"));
    }
    // Remove video from playlist
    playlist.videos.pull(videoId);
    // Save the updated playlist
    await playlist.save();
    // Return the updated playlist
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if (!isValidObjectId(playlistId))
    {
        throw new ApiError(400, "Invalid Playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    // Delete the playlist
    await playlist.deleteOne();
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if (!isValidObjectId(playlistId))
    {
        throw new ApiError(400, "Invalid Playlist ID");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist)
    {
        throw new ApiError(404, "Playlist not found");
    }
    if (!name || !description)
    {
        throw new ApiError(400, "Name and description are required");
    }
    playlist.name = name;
    playlist.description = description;
    await playlist.save();
    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
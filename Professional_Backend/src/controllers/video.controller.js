import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
    //TODO: get all videos based on query, sort, pagination
    if (userId && !isValidObjectId(userId))
    {
        throw new ApiError(400, "Invalid User ID");
    }

    // Build aggregation pipeline
    const matchStage = {};
    // Text search on video title
    if (query)
    {
        matchStage.title = { $regex: query, $options: 'i' };
    }
    // Filter by owner if userId is provided
    if (userId)
    {
        matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortOrder = sortType === "desc" ? -1 : 1;

    const aggregatePipeline = Video.aggregate([
        { 
            $match: matchStage
     },
        { 
            $sort: { 
                [sortBy]: sortOrder 
            } 
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ]);

    const options = {
        page: Number(page),
        limit: Number(limit)
    };
    const videos = await Video.aggregatePaginate(aggregatePipeline, options);
    if (!videos || videos.docs.length === 0)
    {
        return res
        .status(404)
        .json(new ApiResponse(404, [], "No videos found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description)
    {
        throw new ApiError(400, "Title and description are required");
    }
    if (!req.files || !req.files.videoFile || !req.files.thumbnail)
    {
        throw new ApiError(400, "Video file and thumbnail are required");
    }
    const videoFile = req.files.videoFile[0]?.path;
    const thumbnail = req.files.thumbnail[0]?.path;
    if (!videoFile || !thumbnail)
    {
        throw new ApiError(400, "Video file and thumbnail are required");
    }
    const videoFileUrl = await uploadOnCloudinary(videoFile, "video");
    const thumbnailUrl = await uploadOnCloudinary(thumbnail, "image");
    // Check if the upload was successful
    if(!videoFileUrl || !thumbnailUrl)
    {
        throw new ApiError(500, "Failed to upload video or thumbnail");
    }
    // Create video document
    const video = await Video.create({
        title,
        description,
        videoFile: videoFileUrl.url,
        thumbnail: thumbnailUrl.url,
        owner: req.user._id
        });
    return res
        .status(201)
        .json(new ApiResponse(201, video, "Video published successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!isValidObjectId(videoId))
    {
        console.log("Invalid Video ID:", videoId);
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(videoId)
    if (!video)
    {
        throw new ApiError(404, "Video not found");
    }
    console.log("Video found:", video);
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if (!isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(videoId);
    if (!video)
    {
        throw new ApiError(404, "Video not found");
    }
    const { title} = req.body;
    if (!title)
    {
        throw new ApiError(400, "Title is required");
    }
    video.title = title;
    if (req.file)
    {
        const thumbnailUrl = await uploadOnCloudinary(req.file.path, "image");
        if (!thumbnailUrl)
        {
            throw new ApiError(500, "Failed to upload thumbnail");
        }
        video.thumbnail = thumbnailUrl?.url;
    }
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(videoId);
    if (!video)
    {
        throw new ApiError(404, "Video not found");
    }
    await video.deleteOne();
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle publish status
    if (!isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Video ID");
    }
    const video = await Video.findById(videoId);
    if (!video)
    {
        throw new ApiError(404, "Video not found");
    }
    video.isPublished = !video.isPublished;
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`));
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
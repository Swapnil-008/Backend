import mongoose from "mongoose"
import { Comment } from "../models/comment.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid Video ID");
    }

    // Check if the video exists
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const aggregatePipeline = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $sort: { 
                createdAt: -1 
            },   //Sorts comments in descending order of their creation time (latest first).
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $addFields: {
                owner: {
                    $arrayElemAt: ["$owner", 0],
                },
            },
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                updatedAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1,
            },
        },
    ]);

    const options = {
        page: Number(page),
        limit: Number(limit),
    };

    const comments = await Comment.aggregatePaginate(aggregatePipeline, options);

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments retrieved successfully"));
});


const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Video ID")
    }
    // Validate content
    const { content } = req.body
    if (!content || content.trim() === "")
    {
        throw new ApiError(400, "Content cannot be empty")
    }
    // Check if the video exists
    const video = await Video.findById(videoId)
    if (!video)
    {
        throw new ApiError(404, "Video not found")
    }
    // Create the comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "Comment added successfully"))

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId))
    {
        throw new ApiError(400, "Invalid Comment ID")
    }
    // Validate content
    const { content } = req.body
    if (!content || content.trim() === "")
    {
        throw new ApiError(400, "Content cannot be empty")
    }
    //as we are going to update the comment, it means it exists
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            $set: { 
                content 
            }
        },
        { 
            new: true
        }
    )
    if (!comment)
    {
        throw new ApiError(404, "Comment not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId))
    {
        throw new ApiError(400, "Invalid Comment ID")
    }
    const comment = await Comment.findByIdAndDelete(commentId)
    if (!comment)
    {
        throw new ApiError(404, "Comment not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
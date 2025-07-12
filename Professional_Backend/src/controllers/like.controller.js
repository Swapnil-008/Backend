import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Tweet } from "../models/tweet.models.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if (!isValidObjectId(videoId))
    {
        throw new ApiError(400, "Invalid Video ID")
    }
    // Check if the video exists
    const video = await Video.findById(videoId)
    if (!video)
    {
        throw new ApiError(404, "Video not found")
    }
    // Check if the user has already liked the video
    const existingLike = await Like.findOne({   
        video: videoId,
        likedBy: req.user._id
    })
    if (existingLike)
    {
        // If the user has already liked the video, remove the like
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, "Video like removed successfully"))
    }
    else{
        // If the user has not liked the video, add a new like
        const newLike = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        return res
            .status(201)
            .json(new ApiResponse(201, "Video liked successfully", newLike))
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (!isValidObjectId(commentId))
    {
        throw new ApiError(400, "Invalid Comment ID")
    }
    // Check if the comment exists
    const comment = await Comment.findById(commentId)
    if (!comment)
    {
        throw new ApiError(404, "Comment not found")
    }
    // Check if the user has already liked the comment
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if (existingLike)
    {
        // If the user has already liked the comment, remove the like
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, "Comment like removed successfully"))
    }
    else{
        // If the user has not liked the comment, add a new like
        const newLike = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        return res
            .status(201)
            .json(new ApiResponse(201, "Comment liked successfully", newLike))
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if (!isValidObjectId(tweetId))
    {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    // Check if the tweet exists
    const tweet = await Tweet.findById(tweetId)
    if (!tweet)
    {
        throw new ApiError(404, "Tweet not found")
    }
    // Check if the user has already liked the tweet
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })
    if (existingLike)
    {
        // If the user has already liked the tweet, remove the like
        await Like.findByIdAndDelete(existingLike._id)
        return res
            .status(200)
            .json(new ApiResponse(200, "Tweet like removed successfully"))
    }
    else{
        // If the user has not liked the tweet, add a new like
        const newLike = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        return res
            .status(201)
            .json(new ApiResponse(201, "Tweet liked successfully", newLike))
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        likedBy: req.user._id,
        video: { $ne: null }
    })
    .populate("video")
    .sort({ createdAt: -1 })// Sort by creation date, newest first
    if (!likedVideos || likedVideos.length === 0)
    {
        throw new ApiError(404, "No liked videos found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Liked videos fetched successfully", likedVideos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.models.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const user = await User.findById(req.user._id)
    if (!user)
    {
        throw new ApiError(404, "User not found")
    }
    const tweet = await Tweet.create(
        {
            content,
            owner: req.user._id
        }
    )
    return res
        .status(201)
        .json(new ApiResponse(201, "Tweet Created Successfully!"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params
    if (!isValidObjectId(userId))
    {
        throw new ApiError(400, "Invalid User ID")
    }
    // Fetch tweets for the user
    const tweets = await Tweet.find({ owner: userId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 }) // Sort by creation date, newest first
     
    return res
        .status(200)
        .json(new ApiResponse(200, "Tweets fetched successfully", tweets))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params
    const { content } = req.body
    if (!isValidObjectId(tweetId))
    {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    // Validate content
    if(!content || content.trim() === "")
    {
        throw new ApiError(400, "Content cannot be empty")
    }
    // Find and update the tweet
    const tweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    )
    // Check if tweet exists
    if (!tweet)
    {
        throw new ApiError(404, "Tweet not found")
    }
    // Return the updated tweet
    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params
    if (!isValidObjectId(tweetId))
    {
        throw new ApiError(400, "Invalid Tweet ID")
    }
    // Find and delete the tweet
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    // Check if tweet exists
    if (!tweet)
    {
        throw new ApiError(404, "Tweet not found")
    }
    // Return success response
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Tweet deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
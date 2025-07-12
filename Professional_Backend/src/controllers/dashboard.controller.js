import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user._id; // Assuming the user ID is the channel ID
    if(!isValidObjectId(channelId))
    {
        throw new ApiError(400, "Invalid Channel ID");
    }
    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
    const totalLikes = await Like.countDocuments({ channel: channelId });   
    const totalViews = await Video.aggregate([
        {
            $match: { 
                owner: channelId 
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { 
                    $sum: "$views" 
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalViews: 1
            }
        }

    ]);
    const totalViewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;
    return res
    .status(200)
    .json(
        new ApiResponse(200, 
            {
                totalVideos,
                totalSubscribers,
                totalLikes,
                totalViews: totalViewsCount
            }, "Channel stats retrieved successfully")
        );
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId = req.user._id; // Assuming the user ID is the channel ID
    if(!isValidObjectId(channelId))
    {
        throw new ApiError(400, "Invalid Channel ID");
    }
    const videos = await Video.find({ owner: channelId })
        .populate("owner", "username avatar")
        .sort({ createdAt: -1 }); // Sort by creation date, newest first
    if (!videos || videos.length === 0)
    {
        return res
        .status(404)
        .json(new ApiResponse(404, [], "No videos found for this channel"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos retrieved successfully"));
        
})

export {
    getChannelStats, 
    getChannelVideos
}
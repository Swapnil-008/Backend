import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleSubscription = asyncHandler(async (req, res) => {
    // TODO: toggle subscription
    const {channelId} = req.params
    const {subscriberId} = req.body // subscriberId is the user who is subscribing or unsubscribing
    if (!isValidObjectId(channelId) || !isValidObjectId(subscriberId))
    {
        throw new ApiError(400, "Invalid Channel or Subscriber ID");
    }
    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ channel: channelId, subscriber: subscriberId });
    if (existingSubscription)
    {
        // If it exists, delete it
        await Subscription.deleteOne({ _id: existingSubscription._id });
        return res
            .status(200)
            .json(new ApiResponse(200, null, "Unsubscribed successfully"));
    }
    // If it doesn't exist, create a new subscription
    const newSubscription = new Subscription({
        channel: channelId,
        subscriber: subscriberId
    });
    await newSubscription.save();
    return res
        .status(201)
        .json(new ApiResponse(201, newSubscription, "Subscribed successfully"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const channelId = req.user._id; // Now using logged-in user's ID
    if (!isValidObjectId(channelId))
    {
        throw new ApiError(400, "Invalid Channel ID");
    }
    // Get all users who have subscribed to this channel
    const subscriptions = await Subscription.find({ channel: channelId }).select("subscriber");
    if (!subscriptions.length) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No subscribers found"));
    }
    // Get user details of all subscribers
    const subscriberIds = subscriptions.map(sub => sub.subscriber);
    const subscribers = await User.find({ _id: { $in: subscriberIds } })
        .select("_id username avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    // TODO: get subscribed channels
    const subscriberId = req.user._id; // Use logged-in user's ID
    if (!isValidObjectId(subscriberId))
    {
        throw new ApiError(400, "Invalid Subscriber ID");
    }
    // Find all subscriptions for the user
    const channels = await Subscription.find({ subscriber: subscriberId }).select("channel");

    if (!channels.length)
    {
        return res.status(200).json(
            new ApiResponse(200, [], "No subscribed channels found")
        );
    }
    // Extract channel IDs and fetch channel details
    const channelIds = channels.map(sub => sub.channel);
    const subscribedChannels = await User.find({ _id: { $in: channelIds } })
        .select("_id username avatar");

    return res.status(200).json(
        new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully")
    );
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
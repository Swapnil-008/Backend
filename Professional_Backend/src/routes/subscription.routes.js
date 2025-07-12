import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/channel/:channelId")
  .get(getSubscribedChannels)   // List of channels the user has subscribed to
  .post(toggleSubscription);    // Toggle subscription to this channel

router.route("/user/:subscriberId").get(getUserChannelSubscribers);

export default router
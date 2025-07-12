import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.get("/subscribed", getSubscribedChannels); // Use logged-in user ID
router.get("/subscribers", getUserChannelSubscribers); //  Uses req.user._id
router.post("/channel/:channelId", toggleSubscription); // Toggle subscription to a channel


export default router
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Configuration of cors
app.use(
  cors({
    //here we can give the permission, who can send the request or access the backend
    origin: process.env.CORS_ORIGIN, //Where is frontend //set the origin
    credentials: true,
  })
);

// Setting the middlewares

//configuring the JSON(accepting the json)
app.use(express.json({ limit: "16kb" })); //How much json data is acceptable

//configuration for URL encoded
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //We can give the nested objects, when (extended: true)  //How much url encoded is acceptable

//configuration of static
app.use(express.static("public")); //Where the static files exist // Like if we want to keep the files (images, pdfs, etc.) somewhere so anybody can access it

//configuration of cookie-parser
app.use(cookieParser()); //from our server accessing or setting the cookies on the user's browser //like performing the CRUD operations on it.

//routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
// http://localhost:8000/api/v1/users/register

export { app };
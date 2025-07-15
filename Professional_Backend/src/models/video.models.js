import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

//we can store the small files in mongoDB directly also for avoiding to store on another platform and store the string got from that platform, but it is not good practice it increases the load on the database.
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //Cloudinary URL
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

//This is a hook used to add our own plugin
videoSchema.plugin(mongooseAggregatePaginate); //Now we are able to write aggregation queries too 
export const Video = mongoose.model("Video", videoSchema);
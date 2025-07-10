import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//configuration of cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//while uploading the file, there is chance of getting error and sometime it may take time too
//so we are using try catch and async await to handle this situation
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath)
    {
      return null;
    }
    //upload the file on cloudinary
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", //storing the type of resourse, we are going to store with that resource's filePath, auto --> automatically detects the type of resourse
    });
    //file has been uploaded successfully
    console.log("File uploaded successfully : ", uploadResponse.url);
    //delete the file from local machine or unlink
    fs.unlinkSync(localFilePath);
    return uploadResponse;
  } catch (error) {
    console.log("Error while uploading file on cloudinary : ", error);
    //remove the locally saved temporary file as the upload operation has failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
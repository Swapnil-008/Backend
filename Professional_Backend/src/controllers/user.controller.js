import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const registerUser = asyncHandler(async (req, res) => {
  //1. Get user details from frontend
  //2. Validations
  //3. Check if user already exists: username or email
  //4. Check for images, check for avatar
  //5. Upload them to cloudinary, avatar
  //6. Create user object - create entry in database
  //7. Remove password and refresh token field from response
  //8. Check for user creation
  //9. Return response

  //Step1:
  const { fullName, email, username, password } = req.body;
  console.log("Email: ", email);
  console.log("Password: ", password);

  //Step2:
  if ([fullName, username, email, password].some((field) => field?.trim() === "")) {
    //field? -> defines field exists
    console.log("All fields are required")
    throw new ApiError(400, "All fields are required");
  }

  //Step3:
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],   //It finds the first record having the same username or email
  });
  if (existedUser) {
    console.log("User already exists")
    throw new ApiError(409, "User with Username or Email already exists");
  }

  //Step4:
  //We have added multer as a middleware in userRoute.js file which provides some additional options
  const avatarLocaPath = req.files?.avatar[0]?.path;
  // const coverLocalPath = req.files?.coverImage?.[0]?.path;
  //Alternate way
  let coverLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverLocalPath = req.files.coverImage[0].path;
  }
  console.log(avatarLocaPath);
  console.log(coverLocalPath)
  if (!avatarLocaPath) {
    console.log("Avatar is required")
    throw new ApiError(400, "Avatar file is required");
  }

  // //Step5:
  const avatar = await uploadOnCloudinary(avatarLocaPath);
  const coverImage = await uploadOnCloudinary(coverLocalPath);
  if (!avatar) {
    console.log("Avatar upload failed")
    throw new ApiError(404, "Avatar file is required!");
  }

  // //Step6:
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  console.log(user)
  // //Step7:
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" //Fields we want to remove
  );

  // //Step8:
  if (!createdUser) {
    console.log("User not found")
    throw new ApiError(500, "Something went wrong while registering the user!!");
  }

  // //Step9:
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully!"));
});

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    //we are going to call this function after checking all the things like user found or not, password matching, so we don't have to checked here for whether the user is found or not.
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false });  //we set validateBeforeSave: false beacuse we dont't want any validations while setting the generated refreshToken to user object having field refreshToken, otherwise it requires password and all
    return { accessToken, refreshToken }
  }
  catch (error) {
    console.log(error)
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
}

const loginUser = asyncHandler(async (req, res) => {
  //1. get the data from the req.body
  //2. giving access base on the username or email
  //3. check if the user exist
  //4. check if the password is correct
  //5. if the user exist and the password is correct, generate the access token and refresh token
  //6. send the tokens in cookies

  //Step1:
  const { email, username, password } = req.body;
  //we are allowing the user to login with either email or username.
  if (!email && !username) {
    console.log("Email or username is required")
    throw new ApiError(400, "Email or username is required!");
  }
  if (!password) {
    console.log("Password is required")
    throw new ApiError(400, "Password is required!");
  }

  //Step2:
  // this '$' is a mongoDB operator
  const user = await User.findOne({
    $or: [
      { email },
      { username }
    ]
  });
  console.log(user)

  //Step3:
  if (!user) {
    console.log("User not found")
    throw new ApiError(404, "User not found!");
  }

  //Step4:
  const isValidPassword = await user.isPasswordCorrect(password)
  if (!isValidPassword) {
    console.log("Invalid password")
    throw new ApiError(401, "Invalid password!");
  }

  //Step5:
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

  //Optional step
  //we have taken the user's refrence in Step 2 that time the refreshToken field was empty and we have set the refreshToken in Step 5, so still this user object's refreshToken field is empty, so we are taking the refrence of updated user.
  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")    //select is used to remove the defined fields from the existing object, so that object will have access of remaining fields only

  //Step6:
  const options = {
    httpOnly: true,
    secure: true             //now cookies can be modify only from the server not from the frontend, in frontend you can see it only but can't modify it
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken,  //we have sent the tokens in cookies, still we are sending the tokens in response ocz if the user wants to save the response in local memory or mobile there are no cookies, so there they can use the tokens sent in response
          refreshToken
        },
        "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,      //first parameter is used to find the element by it's ID
    {   //$set is the mongoDB operator, used to set some new values to the existing parameters
      $set: {
        refreshToken: undefined
      },
      //Alternative
      // $unset: {
      //   refreshToken: 1   //set the flag 1 to parameters which we want to unsert
      // }
    },
    {
      new: true   //returning response should be with new or updated values for that we have set the new = true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)  //removing the tokens stored in cookies 
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out!"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || rq.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!")
  }
  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedRefreshToken?._id)   //this _id(users unique id to find the user) is the term we are sending in the payload while genrating the refresh token
    if (!user) {
      throw new ApiError(401, "Invalild Refresh Token!")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired!")
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, newRefreshToken }, "Access Token Refreshed!"))
  }
  catch (error) {
    throw new ApiError(401, error?.messahe || "Invalid Refresh Token!")
  }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const user = await User.findById(req.user?._id)
  if (!user) {
    throw new ApiError(404, "User Not Found!")
  }
  const isValidOldPassword = await bcrypt.compare(oldPassword, user.password)
  if (!isValidOldPassword) {
    throw new ApiError(400, "Invalid Old Password!")
  }
  user.password = newPassword  //we don't have to hash the new password because we have added the pre middleware while saving the password which converts the original password to hashed password
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully!"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user?._id)
  // if(!user)
  // {
  //   throw new ApiError(404, "User Not Found!")
  // }
  // return res
  // .status(200)
  // .json(new ApiResponse(200, user, "User Found!"))

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User Found!"))
})

//if you want to update any file then handle it differently from the text fields
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required!")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        fullName,
        email: email    //Both are valid ways
      }
    },
    {
      new: true,
    }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details Updated Successfully!"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!")
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath)  //it returns the object of the avatar from the cloudinary and we just want to extract the url from it
  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading an Avatar!")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true,
    }
  ).select("-password")
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar Updated Successfully!"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover Image file is missing!")
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uploading a Cover Image!")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated Successfully!"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params
  if (!username?.trim()) {
    throw new ApiError(401, "Username is missing!")
  }
  const channel = await User.aggregate(
    [
      {
        $match: {
          username: username?.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscribers",
          as: "subscribedTo"
        }
      },
      {
        $addFields: {
          subscribersCount: { 
            $size: "$subscribers" 
          },
          channelSubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },    //it means, there is a field subscriber in 'subscribers' schema, so check whether it is matching with user._id or not if it is matched it means user is subscribed to this channel otherwise it is not subscribed to this channel
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {  //Fields which we want to send
          fullName: 1,
          username: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          subscribersCount: 1,
          channelSubscribedToCount: 1,
          isSubscribed: 1
        }
      }
    ]
  )

  if(!channel?.length)
  {
    console.log("Failed to fetch channel!")
    throw new ApiError(404, "chennel does not exists!")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, channel[0], "User channel fetched successfully!")
  )
})

const getWatchHistory = asyncHandler(async (req, res) => {
  // req.user._id  -->  it provides the string of the user's id not complete id (complete id = object (in which the string is present))
  //but mongoose directly converts it into the complete object
  const user = await User.aggregate(
    [
      {
        $match: {
          // _id: req.user._id -->  but here we can't use like this, because in aggregation pipeline mongoose doesn't work so here we have to create the ID manually
          _id: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "videos",
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [   //sub pipeline
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      fullName: 1,
                      username: 1,
                      avatar: 1
                    }
                  }
                ]
              }
            },
            {
              $addFields: {
                owner: { 
                  $arrayElemAt: ["$owner", 0] 
                }
              }
            }
          ]
        }
      }
    ]
  )
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      user[0].watchHistory,
      "User watch history fetched successfully!"
    )
  )
})

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory
};
//https://chatgpt.com/share/686f9a24-3440-8000-9883-7efd9206cdfa This is the chatgpt link for why login and logout doesn't support the data sent in form-data foramt and supports when then the data comes in JSON format
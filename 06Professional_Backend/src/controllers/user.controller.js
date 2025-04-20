import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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
  console.log("Email: ", email)

  //Step2:
  if ([fullName, username, email, password].some((field) => field?.trim() === "")) //field? -> defines field exists
  {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne(
    {
      $or: [{ username }, { email }]
    }
  )
  //Step3:
  if (existedUser) {
    throw new ApiError(409, "User with Usernmae or Email already exists");
  }

  //Step4:
  const avatarLocaPath = req.files?.avatar[0]?.path    //We have added multer as a middleware which provides some additional options
  const coverLocalPath = req.files?.avatar[0]?.path

  if (!avatarLocaPath)
  {
    throw new ApiError(400, "Avatar file is required");
  }

  //Step5:
  const avatar = await uploadOnCloudinary(avatarLocaPath);
  const cover = await uploadOnCloudinary(coverLocalPath);

  if (avatar)
  {
    throw new ApiError(404, 'Avatar file is required!')
  }

  //Step6:
  const user = await User.create(
    {
      fullName,
      avatar: avatar.url,
      cover: cover?.url || "",
      email,
      password,
      username: username.toLowerCase()
    }
  )

  //Step7:
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"   //Fields we want to remove
  )

  //Step8:
  if(!createdUser)
  {
    throw new ApiError(500, 'Something went wrong while registering the user')
  }

  //Step9:
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully!")
  )


});

export { registerUser };
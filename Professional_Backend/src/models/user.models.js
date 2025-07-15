import mongoose, {Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//As we have import the Schema from mongoose, that's why we are using the 'Schema()', otherwise it is mongoose.Schema()
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,     //when you want to use a field to search frequently, then setting index true is much benifical
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0]^/], 
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //Cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String, 
      required: [true, "Password is required!"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//pre hook is a middleware it is used to do something just before whatever we are going to do(like below, we are going to save the data)
//bcrypt the password //In the process of bcrypt we have used async to function, because sometimes the password takes time
//pre is a middleware //here we have used it for bcrypt the password just before save the password
userSchema.pre("save", async function (next) {   //here we can't use arrow function because we want to access the reference of user, which we get from 'this' and 'this' is not accessible inside arrow function.
  //next is passed to the function because we are using a middleware and at the end of middleware we have to call the next, so it passes to the next middleware and then next middleware will be execute.
  const user = this;
  //if the password is not modified then directly return 'next' to the next middleware otherwise on midification of any field the password will be changed.
  if (!user.isModified("password"))
  {
    return next();
  }
  //Alternate way to hash the password
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(user.password, salt);
  // user.password = hashedPassword;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

//Every schema has methods object in that we can define our own custom methods
//Adding our custom method in mongoDB to check whether entered password is correct or not while login
userSchema.methods.isPasswordCorrect = async function (password) {
  //Password -> entered password while login   //this.password -> hashed password
  return await bcrypt.compare(password, this.password);
};

//Adding another method to generate access token and this process works fast, so there is no need of async-await
userSchema.methods.generateAccessToken = function () {
  const payload = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.username,
  };
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const payload = {
    _id: this._id,
  };
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  return token;
};

export const User = mongoose.model("User", userSchema);
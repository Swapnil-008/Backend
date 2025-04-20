import { mongoose, Schema } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0]^/]
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  //Cloudinary url
            required: true
        },
        coverImage: {
            type: String  //Cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video'
            }
        ],
        password: {
            type: String,
            required: [true, "Password is required!"]
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

//bcrypt the password //the process of bcrypt the password takes sometime that's why we have used async to function
//pre is a middleware //here we have used it for bcrypt the password just before save the password
userSchema.pre("save", async function (next) {
    const user = this;
    //if password is not modified then directly return 'next' to next middleware
    if (!user.isModified("password")) {
        return next();
    }
    //Alternate way
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(user.password, salt);
    // user.password = hashedPassword;
    user.password = await bcrypt.hash(user.password, 10);
    next();
})

//Adding our custom method to mongoDB to check whether entered password is correct or not while login
userSchema.methods.isPasswordCorrect = async function (password) {
    //Password -> entered password while login   //this.password -> hashed password
    return await bcrypt.compare(password, this.password);
}

//Adding another method to generate access token and as this process works fast, so there is no need of async-await
userSchema.methods.generateAccessToken = function () {
    const payload = {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.username
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
    return token;
}

userSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
    return token;
}

export const User = mongoose.model("User", userSchema)
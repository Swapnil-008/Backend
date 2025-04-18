import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'], //Custom validations, it means if by chance user trying to login or register without entering password then it will dispay this message 'Password is required'
    },
  },
  {
    //Timestamp always adds in secondary object
    timestamps: true, //Which adds  two fields createdAt(), and updatedAt()
  }
);

export const User = mongoose.model('User', userSchema);

//In mongoDB, it will store as a 'todos', 's'(in plural state) will add in end and convert into all lowercase

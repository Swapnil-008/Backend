import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//Database is always in another continent, so it might takes time so always try to use async await while connecting or fetching the data from the database.
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MongoDB Connected... DB HOST: ${connectionInstance.connection.host}`);  //try to print connectionInstance and check what it gives.
  }
  catch (error)
  {
    console.error(error.message);
    process.exit(1);   //this process gives the reference of the current working process.
  }
};

export default connectDB;

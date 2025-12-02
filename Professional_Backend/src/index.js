// import {DB_NAME} from './constants.js'
// import express from 'express'
// const app = express()
// import mongoose from "mongoose";
import dotenv from "dotenv";      //as early as possible, dotenv should be import so all the env variables will be accessible in our project's main file
import connectDB from "./db/index.js";
import { app } from "./app.js";

//use to configure the dotenv with it's path
dotenv.config({
  path: "./.env",
});

//We have defined the code of connectivity between the backend and mongoDB in index.js file in DB folder and import that file here and called
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running on port :", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

/*
//IIFE (Immediately Invoked Function Expression) -> which calls automatically just after the function defination using parenthesis, there is no need to call it explicitly.
//Here we are just creating a function and calling it.
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('Connected to MongoDB')
        // if even the database is connected but still the express is not able to listen for that the below error is mentioned.
        app.on("error", () => {
            console.log('Error connecting to MongoDB')
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    }
    catch (error)
    {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
})()
*/

//Simpified version of above code.
// const connectMongoDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//     console.log('Connected to MongoDB')
//     // if even the database is connected but still the express is not able to listen for that the below error is mentioned.
//     app.on("error", () => {
//       console.log('Error connecting to MongoDB')
//       throw error
//     })

//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on port ${process.env.PORT}`)
//     })
//   }
//   catch (error) {
//     console.error('Error connecting to MongoDB:', error)
//     throw error
//   }
// }

// connectMongoDB();
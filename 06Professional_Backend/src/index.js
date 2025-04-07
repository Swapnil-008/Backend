//require('dotenv').config({path: './env})
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {DB_NAME} from './constants.js'
import connectDB from './db/index.js'

import express from 'express'
const app = express()
connectDB()
/*
//Here we are creating a function and calling it
( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log('Connected to MongoDB')
        app.on("error", () => {
            console.log('Error connecting to MongoDB')
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error)
        throw error
    }
})()
*/
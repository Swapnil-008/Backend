import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import connectDB from './connectDb.js'

const app = express()

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server listening on ${process.env.PORT}`)
        }
        )
    })
    .catch(() => {
        console.log("Database not connected!")
    })
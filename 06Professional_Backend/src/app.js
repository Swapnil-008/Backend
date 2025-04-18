import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//Configuration of cors
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,  //Where is frontend
        credentials: true
    }
))
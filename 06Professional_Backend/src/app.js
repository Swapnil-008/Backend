import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

//Configuration of cors
app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,  //Where is frontend //set the origin
        credentials: true
    }
))

//configuring the JSON(accepting the json)
app.use(express.json({limit: "16kb"}))  //How much json is acceptable

//configuration for URL encoded
app.use(express.urlencoded({extended: true, limit: "16kb"})) //We can give the nested objects (extended: true)  //How much url encoded is acceptable

//configuration of static
app.use(express.static('public')) //Where are the static files // Like if we want to keep the files (images, pdfs, etc.) somewhere so anybody can access it

//configuration of cookie-parser
app.use(cookieParser()) //Where are the cookies stored //We can set the cookies in the browser

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use('/api/v1/users', userRouter)

// http://localhost:8000/api/v1/users/register

export {app}

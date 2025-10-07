import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import DBConnect from './config/dbConnect.js'
import ErrorHandler from './middleware/ErrorHandler.js'
import { connectRedisClient } from './config/RedisClient.js'
import UserRoutes from './routes/User.routes.js'

dotenv.config()
const port = process.env.PORT
const app = express()
DBConnect()
connectRedisClient()
app.use(express.json())
app.use(cors({
    origin:"*",
    credentials:true
}))

//routes
app.use('/api' , UserRoutes)

app.use(ErrorHandler)

app.listen(port , ()=>{
    console.log(`Authentication server is running at http://localhost:${port}`);
})
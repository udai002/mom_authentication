import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import grpc from '@grpc/grpc-js'
import {Stores} from 'mom-protos'

import DBConnect from './config/dbConnect.js'
import ErrorHandler from './middleware/ErrorHandler.js'
import { connectRedisClient } from './config/RedisClient.js'
import UserRoutes from './routes/User.routes.js'
import permissionsrouter from './routes/permissions.routes.js'
import roleRoutes from './routes/Role.routes.js'

dotenv.config()
const port = process.env.PORT
const app = express()
DBConnect()
connectRedisClient()
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

const grpcService = new Stores.storesDataClient("0.0.0.0:5001" , grpc.credentials.createInsecure() , (err , data)=>{
    console.log("this is connected..." , data)
})

grpcService.storeDetails({storeId:"1"} , (err , response)=>{
    console.log(response)
})



//routes
app.use('/api' , UserRoutes)
app.use('/api/permission', permissionsrouter)
app.use("/api/role" , roleRoutes)

app.use(ErrorHandler)

app.listen(port , ()=>{
    console.log(`Authentication server is running at http://localhost:${port}`);
})
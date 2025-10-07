import * as z from 'zod'

import TryCatch from '../utils/TryCatch.js'
import ApiError from '../Error/ApiError.js'
import { user } from '../schemas/user.schema.js'
import Users from '../models/user.model.js'
import ApiResponse from '../utils/ApiResponse.js'


class UserController {

    getUsers= TryCatch(async (req , res)=>{
        const userData = await Users.find({})
        // res.json(new ApiResponse("Data Successfully fetched" , 200 , userData))
        throw new ApiError("this is for example" , 401 , false)
    })


    createUser = TryCatch(async (req , res)=>{
        const parse = user.parse(req.body)
        console.log(parse)
        
        const registerUser  = Users.create(parse)
        res.json(new ApiResponse("Registered successfully" , 201 , registerUser))
    })
}

export default UserController
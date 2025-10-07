import type { NextFunction, Request, Response } from "express";
import ApiError from "../Error/ApiError.js";


const ErrorHandler = async(err:any , req:Request , res:Response , next:NextFunction)=>{
    console.log("Error from middleware " , err)
    if(err instanceof ApiError){
        res.status(err.statusCode).json(new ApiError(err.message , err.statusCode , err.success))
        return ;
    }

    res.status(500).json({message:"Internal server error", status:false})
}

export default ErrorHandler
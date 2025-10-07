import type { NextFunction, Request, RequestHandler, Response } from "express"

const TryCatch =(handler:RequestHandler)=>{
    return async (req:Request , res:Response , next:NextFunction)=>{
        Promise.resolve(handler(req , res , next)).catch(next)
    }
}

export default TryCatch
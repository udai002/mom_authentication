import { Rolemembervalidation } from "../schemas/RoleMember.schema.js";
import ApiError from '../Error/ApiError.js';
import Rolemember from "../models/Rolemember.model.js";
import ApiResponse from '../utils/ApiResponse.js';
import TryCatch from '../utils/TryCatch.js';

class RolememberController{


// create rolemember

     CreateRolemember=TryCatch(async (req , res)=>{
        console.log(req.body)
        const parse = Rolemembervalidation.safeParse(req.body)
        console.log(parse.error)
        if(!parse.success){ throw new ApiError( "validation failed",401 , false)}
        const newRolemember = await Rolemember.create(parse.data);
        console.log("rolemember body data",newRolemember);



    res.json(new ApiResponse("Rolemember created successfully", 201, newRolemember));
  });


//   get the rolemember
//   GetRolemember=TryCatch(async (req , res)=>{
//     const {id} = req.params
//     const rolemember = await Rolemember.findById(id)
//     if(!rolemember) throw new ApiError("Rolemember not found",404 , false)
//     res.json(new ApiResponse("Rolemember retrieved successfully", 200, rolemember));
//   });


  getRolemembers=TryCatch(async(req,res)=>{
    const rolemembers=await Rolemember.find({});
   
    res.json(new ApiResponse("Data Fetched successfully",200 ,rolemembers));
  })

}

export default RolememberController;
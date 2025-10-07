import mongoose, { Schema, Types } from "mongoose";
import type { IUser } from "../types/user.types.js";

const UserSchema = new Schema<IUser>({
    name:{
        type:String , 
        required:true
    } , 
    email:{
        type:String , 
        required:true ,
    } , 
    contactNumber:{
        type:String , 
        required:true 
    } , 
    photo:{
        type:String , 
        required:true
    } , 
    clusterId:{
        type:Schema.Types.ObjectId , 
    } , 
    storeId:{
        type:Schema.Types.ObjectId
    },
    roleId:{
        type:Schema.Types.ObjectId
    } , 
    refreshToken:{
        type:String 
    } , 
    password:{
        type:String , 
    },
    isActive:{
        type:Boolean ,
    }
})

const Users = mongoose.model("Dashboard Users" , UserSchema)

export default Users
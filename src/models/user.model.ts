import mongoose, { Schema, Types } from "mongoose";
import type { IUser } from "../types/user.types.js";
import crypto from 'crypto'

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
    },

    //  passwordChangedAt: Date,
  passwordResetToken: String,
//   passwordResetTokenExpires: Date,
//      resetPasswordToken: String,
//   resetPasswordExpire: Date,
    
  
})

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  console.log("Hashed Token (saved in DB):", this.passwordResetToken);

  return resetToken;
};






const Users = mongoose.model("Dashboard Users" , UserSchema)

export default Users
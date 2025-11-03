import mongoose, { model, Schema } from "mongoose";
import type {RolememberInput} from "../schemas/RoleMember.schema.js";

const RolememberSchema= new Schema<RolememberInput>({
    MemberId:{
        type:String,
        required:true
    },
    FullName:{
        type:String,
        required:true
    },
    ContactDetails:{
        type:String,
        required:true
    },
    Role:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        enum:['Active','InActive'],
        required:true
    }
})
const Rolemember=mongoose.model("Rolemembers",RolememberSchema)
export default Rolemember
import mongoose, {Schema } from 'mongoose';
import type { permissions } from '../schemas/permissions.schema.js';

const PermissionsSchema = new Schema<permissions>({
    permissionName:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required: true,
        default:false
    },
    service:{
        type:String , 
        required:true
    }

})

const permissional = mongoose.model("Dashboard permissions", PermissionsSchema)

export default permissional
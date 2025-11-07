import mongoose, { Schema, Types } from "mongoose";
import type { IPermission } from "../types/role.types.js";

const roleSchema = new Schema<IPermission>({
  roleId: {
    type: String,
    required :true,
    unique:true
  },
  roleName: {
    type: String,
    required: true,
    unique:true    
  },
  permissions: [
    {
      permissionId: {
        type:String,
        required: true, 
        // ref:"Permissions"
      },
      status: {
        type: String,
        enum: ["Read", "Write", "None"],
        default: "Read",
        required: true,
      },
    },
  ],
});

const Roles = mongoose.model("Dashboard Roles", roleSchema);

export default Roles;

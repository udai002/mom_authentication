import type { Types } from "mongoose";
import type { UserInput } from "../schemas/user.schema.js";

export interface IUser extends  Document , UserInput{
    roleId:Types.ObjectId ;
    clusterId:Types.ObjectId ;
    storeId:Types.ObjectId ;     
}



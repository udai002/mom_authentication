import ApiError from "../Error/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import UserModel from "../models/user.model.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { fa } from "zod/locales";


class RsetPassword {
  resetPassword = TryCatch(async (req, res) => {
    const { resetTocken, newPassword } = req.body;
    console.log("restToken", resetTocken);
    console.log("newPassword is", newPassword);

    if (!resetTocken || !newPassword) 
    {
      throw new ApiError("tocken r password missing", 401, false);
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetTocken)
      .digest("hex");

    console.log("hased tocken", hashedToken);


    const user = await UserModel.findOne({
      passwordResetToken: hashedToken
    });
          console.log("user find sucessfull",user)

    if (!user) 
    {
        throw new ApiError("user not found",401,false)

    }
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = newPassword
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

     res.json(new ApiResponse("Reset successfully" , 201 , user))

    //  throw new ApiError("Failed to Reset Password" , 401 , false)




  });
}

export default RsetPassword

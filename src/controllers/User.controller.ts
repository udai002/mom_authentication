import * as z from "zod";
import TryCatch from "../utils/TryCatch.js";
import ApiError from "../Error/ApiError.js";
import { user } from "../schemas/user.schema.js";
import Users from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { client } from "../config/RedisClient.js";
import transportMail from "../config/nodemailer.js";
import { fa } from "zod/locales";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { setMaxListeners } from "nodemailer/lib/xoauth2/index.js";

class UserController {
  getUsers = TryCatch(async (req, res) => {
    const userData = await Users.find({});
    res.json(new ApiResponse("Data Successfully fetched", 200, userData));
    throw new ApiError("this is for example", 401, false);
  });

  createUser = TryCatch(async (req, res) => {
    const parse = user.parse(req.body);
    console.log("parse password", parse.password);
    const { email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("hash password", hashPassword);

    parse.password = hashPassword;
    console.log("parsehash password", hashPassword);

    const userexisted = await Users.findOne({ email });
    if (userexisted) {
      throw new ApiError("User already existed", 409, false);
    }

    console.log("email is ", email);

    const registerUser = Users.create(parse);
    res.json(new ApiResponse("Registered successfully", 201, registerUser));
  });

  requestSignupOtp = TryCatch(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new ApiError("Email requred", 400, false);
    }

    const userexisted = await Users.findOne({ email });
    if (userexisted) {
      throw new ApiError("User already existed", 409, false);
      // console.log("user already existed");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const redisotp = await client.setEx(
      `signup:${email}:otp`,
      300,
      JSON.stringify(otp)
    );

    console.log(".........rediesOTP", redisotp);
    console.log("this is the otp we are setting in the redis", redisotp, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for mompharmacy signup",
      text: `Your OTP for signup is ${otp}`,
    };

    const info = await transportMail.sendMail(mailOptions);

    console.log("Signup OTP email sent:", info.response);

    res.json(new ApiResponse("Data Successfully fetched", 200, info.response));

    // throw new ApiError("failed to send OTP",409,false);
  });

  verifySignupOtp = TryCatch(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ApiError("User already existed", 400, false);
    }
    console.log("email n otp", email, otp);

    const redisOtp = await client.get(`signup:${email}:otp`);
    console.log("redisOtp", redisOtp);

    if (!redisOtp) {
      throw new ApiError("OTP expired or not found", 400, false);
    }

    const parsedOtp = JSON.parse(redisOtp);

    if (Number(parsedOtp) !== Number(otp)) {
      throw new ApiError("Invalid OTP", 400, false);
    }

    await client.setEx(`signup:${email}:verified `, 600, JSON.stringify(true)); // 10 minutes
    res.json(new ApiResponse("Email OTP verified successfully", 500, true));
  });

  SignIn = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError("Email or Password missing", 400, false);
    }

    console.log("email , password", email, password);

    const findUser = await Users.findOne({ email });
    console.log("findUser", findUser);

    if (!findUser) {
      throw new ApiError("The user not found", 400, false);
    }

    console.log("pss", findUser.password);

    const checkPassword = await bcrypt.compare(password, findUser.password);

    const isMatch = await bcrypt.compare(password, findUser.password);
    
    // if(password!=findUser.password)
    // {
    //   throw new ApiError("User password not match",400,false)

    // }

    console.log("checkPassword", isMatch);

    if (!isMatch) {
      throw new ApiError("User password not match", 400, false);
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    console.log("otp to send mail", otp);

    const redisotp = await client.setEx(
      `login:${email}:otp`,
      300,
      JSON.stringify(otp)
    );

    console.log(".........rediesOTP", redisotp);
    console.log("this is the otp we are setting in the redis", redisotp, otp);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP for mompharmacy login",
      text: `Your OTP for login is ${otp}`,
    };

    const info = await transportMail.sendMail(mailOptions);

    console.log("Lgin OTP email sent:", info.response);

    res.json(new ApiResponse("Data Successfully fetched", 200, info.response));
  });

  verifyLoginOtp = TryCatch(async (req, res) => {
    const { email, otp } = req.body;
    if (!otp) {
      throw new ApiError("Email or Password missing", 400, false);
    }

    console.log("email , otp", email, otp);

    const findUser = await Users.findOne({ email });
    console.log("findUser", findUser);

    if (!findUser) {
      throw new ApiError("The user not found", 400, false);
    }

    const redisOtp = await client.get(`login:${email}:otp`);
    console.log("redisOtp", redisOtp);

    if (!redisOtp) {
      throw new ApiError("OTP expired or not found", 400, false);
    }

    const parsedOtp = JSON.parse(redisOtp);

    if (Number(parsedOtp) !== Number(otp)) {
      throw new ApiError("Invalid OTP", 400, false);
    }

    if (Number(parsedOtp) == Number(otp)) {
      const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      const rediesTocken = await client.setEx(
        `user:${token}`,
        43200,
        JSON.stringify({ id: findUser._id })
      );

      console.log("This is token", rediesTocken);

      res.json(new ApiResponse("Email OTP verified successfully", 500, true));
    }

    throw new ApiError("Invalid OTP or email", 400, false);
  });
}

export default UserController;

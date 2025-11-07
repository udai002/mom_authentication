import * as z from "zod";
import TryCatch from "../utils/TryCatch.js";
import ApiError from "../Error/ApiError.js";
import { user } from "../schemas/user.schema.js";
import Users from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { client } from "../config/RedisClient.js";
import transportMail from "../config/nodemailer.js";
import { fa } from "zod/locales";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
// import { setMaxListeners } from "nodemailer/lib/xoauth2/index.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";


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
    console.log("req body", req.body);

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

    // const isMatch = await bcrypt.compare(password, findUser.password);
    
    // if(password!=findUser.password)
    // {
    //   throw new ApiError("User password not match",400,false)

    // }

    console.log("checkPassword", checkPassword);

    if (!checkPassword) {
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

    res.json(new ApiResponse("Data Successfully fetched", 200, { email }));
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
       const payload = {
        id: findUser._id,
        roleId: findUser.roleId,
        clusterId: findUser.clusterId,
        storeId: findUser.storeId,
      };
      const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });

      const rediesTocken = await client.setEx(
        `user:${token}`,
        43200,
        JSON.stringify({ payload})
      );

      console.log("This is token", rediesTocken);

      res.json(new ApiResponse("Email OTP verified successfully", 500, true));
    }

    throw new ApiError("Invalid OTP or email", 400, false);
  });



  CreateRolemember = TryCatch(async (req, res) => {
    console.log("Incoming request body:", req.body);
    // console.log("Uploaded file:", req.file);

    const parse = user.safeParse(req.body);
    if (!parse.success) {
      console.log("Validation Error:", parse.error);
      throw new ApiError("Validation failed", 401, false);
    }

    // Generate random password
    const length = 7;
    const password = crypto.randomBytes(length).toString("base64").slice(0, length);

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("Generated hashed password:", hashPassword);

    // Save user data to DB
    const newRolemember = await Users.create({
      ...parse.data,
      password: hashPassword,
    });

    // Prepare onboarding email
    const onBoardingUrl = `http://localhost:5173/Addimage`;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Onboarding Details</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f1f3f4; margin: 0; padding: 0; }
          .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); text-align: center; }
          h2 { color: #202124; font-size: 24px; margin-bottom: 20px; }
          p { color: #202124; font-size: 16px; line-height: 1.6; }
          .pswd { font-size: 16px; color: #007bff; font-weight: bold; }
          .reset-link { display: inline-block; color: white; padding: 12px 25px; font-size: 16px; text-decoration: none; border-radius: 5px; margin: 20px 0; background-color: #007bff; }
          .footer { margin-top: 30px; color: #5f6368; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Welcome to mompharmacy</h2>
          <p>Your onboarding process has started. Use the password below to log in:</p>
          <p class="pswd">${password}</p>
          <a class="reset-link" href="${onBoardingUrl}">Access Portal</a>
          <p class="footer">Please change your password after logging in for security.</p>
        </div>
      </body>
      </html>
    `;


    console.log("onBoardingUrl:", onBoardingUrl);

    const mailOptions = {
      from: "HR Manager <hr@mompharmacy.com>",
      to: parse.data.email,
      subject: "Onboarding Process - Mompharmacy",
      html, 
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending onboarding email:", err);
      } else {
        console.log("Onboarding email sent:", info.response);
      }
    });

    res.status(201).json(
      new ApiResponse("Rolemember created and email sent successfully", 201, newRolemember)
    );
  });
}

export default UserController;

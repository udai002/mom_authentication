import express from 'express'
import UserController from '../controllers/User.controller.js'
import ForgotPassword from '../controllers/ForgotPassword.controller.js'
import ReserPassword from '../controllers/ResetPassword.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'
const router =  express.Router()
const userControllers = new UserController()
const ForgotPasswords = new ForgotPassword()
const ReserPasswords = new ReserPassword()


router.get("/all", authMiddleware, userControllers.getUsers);
router.get("/user" , userControllers.getUsers)
router.post("/create" , userControllers.createUser)
router.post("/forgot" , ForgotPasswords.forgotPswd)
router.post("/reset",ReserPasswords.resetPassword)
router.post("/signup/request-otp", userControllers.requestSignupOtp);
router.post("/signup/verify-otp", userControllers.verifySignupOtp);
router.post("/login/request-otp",userControllers.SignIn);
router.post("/login/verify-otp",userControllers.verifyLoginOtp)


export default router
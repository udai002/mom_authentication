import express from 'express'
import UserController from '../controllers/User.controller.js'
import ForgotPassword from '../controllers/ForgotPassword.controller.js'
import ReserPassword from '../controllers/ResetPassword.controller.js'

const router =  express.Router()
const userControllers = new UserController()
const ForgotPasswords = new ForgotPassword()
const ReserPasswords = new ReserPassword()


    
router.get("/user" , userControllers.getUsers)
router.post("/create" , userControllers.createUser)
router.post("/forgot" , ForgotPasswords.forgotPswd)
router.post("/reset",ReserPasswords.resetPassword)


export default router
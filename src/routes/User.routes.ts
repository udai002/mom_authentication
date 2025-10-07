import express from 'express'
import UserController from '../controllers/User.controller.js'

const router =  express.Router()
const userControllers = new UserController()

router.get("/user" , userControllers.getUsers)
router.post("/user" , userControllers.createUser)

export default router
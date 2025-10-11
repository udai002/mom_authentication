import express from 'express'
import permissionsControllers from '../controllers/permissions.controller.js'

const router = express.Router()
const permissionsActions = new permissionsControllers()

router.post('/createpermission', permissionsActions.CreatePeremissions)
router.get('/getpermission',permissionsActions.getPermissions)
router.get('/getpermission/:id',permissionsActions.getPermissionsById)

export default router
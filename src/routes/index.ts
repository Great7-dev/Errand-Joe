import express, { Request, Response, NextFunction } from 'express';
import { LoginUser, RegisterUser, UpdateProfile } from '../controller/userController';
const router = express.Router()


router.post('/register',RegisterUser)
router.post('/login', LoginUser)
// router.post('/auth/google', LoginUser)
router.put('/update/:id', UpdateProfile)



export default router;

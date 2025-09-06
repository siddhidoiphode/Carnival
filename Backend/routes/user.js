import express from 'express';
import {updateProfileController,registerController,loginController,getProfileController} from '../controller/user.js'
import {requireSignIn} from '../middleware/authMiddleware.js'

const router = express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.put("/profile",requireSignIn,updateProfileController);
router.get("/profile",requireSignIn, getProfileController);

export default router;
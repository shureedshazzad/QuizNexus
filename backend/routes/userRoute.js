import express from "express";
const router = express.Router();
import { authUser ,  
     logoutUser,
    registerUser,
    verifyOTPReg,
    forgetPassword,
    verifyOTP,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserbyId,
    } from "../controllers/userController.js";
import { protect , admin} from "../middleware/authMiddleware.js";


router.post('/auth',authUser);
router.post('/logout',logoutUser);
router.post('/',registerUser);
router.post('/verify-otp-reg',verifyOTPReg);
router.post('/forget-password',forgetPassword);
router.post('/verify-otp',verifyOTP);
router.post('/reset-password',resetPassword);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/').get(protect,admin,getUsers)
router.route('/:id').get(protect,getUserbyId);


export default router;
import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";


//protect routes

const protect = asyncHandler(async (req, res, next) =>{
    let token;

    //read the jwt from the cookie

    token=req.cookies.jwt;





    if(token)
    {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('No authorized , token failed');
        }
    }
    else{
        res.status(401);
        console.log('Token:', token);
        throw new Error('No authorized , no token');
    }
});

//admin middleware

const admin = (req , res , next) => {
    if(req.user && req.user.isAdmin)
    {
        next();
    }
    else{
        res.status(401);
        throw new Error('Not Authorized As Admin');
    }
}


export { protect , admin };
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req , res , next) =>{
    try{
        const token = req.headers.authorization?.replace("Bearer " , "");

        if(!token){
            throw new ApiError(401 , "Unauthorized");
        }

        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        
        // const user = await User.findById(decoded._id).select("-password");

        // if(!user){
        //     throw new ApiError(401 , "Invalid token");
        // }

        req.user = decoded;
        next();

    }catch(err){
        next(new ApiError( 401 , "Invalid or expired token"));
    }
}
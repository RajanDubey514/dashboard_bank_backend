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
        req.user = decoded;
        next();

    }catch(err){
        next(new ApiError( 401 , "Invalid or expired token"));
    }
}
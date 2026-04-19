import ApiError from "../utils/ApiError.js";

export const authorizedRoles = (...allowedRoles) =>{
    return(req , res , next ) =>{
        if(!allowedRoles.includes(req.user.role)){
            console.log(req.user.role , "req.user.role")
            console.log(allowedRoles , "allowedRoles")
            throw new ApiError(403 , "Access denied");
        }
        next();
    }
}
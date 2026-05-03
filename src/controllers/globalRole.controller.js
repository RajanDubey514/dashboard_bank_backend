import { PROTECTED_ROLES } from "../constants/protected.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";

export const createRoleStatus = asyncHandler( async(req, res) =>{
    const {name} = req.body;
    //validation
    if(!name){
        throw new ApiError(400 , "All fields are required")
    }
    // check existing
     const existing = await Role.findOne({
        name : name.toUpperCase()
     })

     if(existing){
        throw new ApiError(409 , "Role already exists")
     }

     const role = await Role.create({
        name : name.toUpperCase()
     })

     return res.status(201).json( 
        new ApiResponse(201 , role , "Role Create successfully")
     )
})

export const updateRoleStatus = asyncHandler( async(req , res) =>{
    const {id} = req.params;
    const {name} = req.body;
   

      if(!name){
        throw new ApiError(400 , "All fields are required")
    }

    const searchRole = await Role.findById(id);
    if(!searchRole){
      throw new ApiError(404 , "Role does not exists");
    }

    //protection logic account Status
    if(PROTECTED_ROLES.includes(searchRole.name)){
        throw new ApiError(403 , "This Account Status cannot be Updated");
    }
    
    searchRole.name = name.toUpperCase();
    await searchRole.save();

    return res.status(200).json(
        new ApiResponse(201 , searchRole , "Role successfully Updated")
    )

})

export const deleteRoleStatus = asyncHandler(async (req , res) =>{
    const {id} = req.params;
    
    const searchRole = await Role.findById(id);
    if(!searchRole) {
        throw new ApiError(404 , "Role does not found");
    }

    if(PROTECTED_ROLES.includes(searchRole.name)){
        throw new ApiError(403 , "This Role can not be deleted");
    }

     // Default fallBack = USER Role
     const defaultRole = await Role.findOne({name : "USER"});

     if(!defaultRole){
     throw new ApiError(500 , "Default INACTIVE status not found");
     }

     await User.updateMany(
        { Role : id} ,
        { $set : {Role : defaultRole._id}}
     );

     //delete status
     await searchRole.deleteOne();

     return res.status(200).json(
        new ApiResponse( 200 , {} , "Role successfully deleted")
     )
})

export const getAllRoleStatus = asyncHandler(async (req , res) =>{
    const allRoleData = await Role.find()
     
    return res.status(200).json(
        new ApiResponse(200 , allRoleData , "All Roles")
    );
})
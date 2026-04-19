import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { AccountStatus } from "../models/accountStatus.model.js";
import { PROTECTED_ACCOUNT_STATUSES } from "../constants/protected.js";
import { User } from "../models/user.model.js";


// create account status
export const createAccountStatus = asyncHandler( async (req , res) =>{
    const {name} = req.body;
   
    //validation
    if(!name){
     throw new ApiError( 400 , "All fields are required")
    }

    // check existing 
    const existing = await AccountStatus.findOne({ name : name.toUpperCase() });

    if(existing){
        throw new ApiError(409 , "Account Status all ready exists")
    }

    const account_Status = await AccountStatus.create({
        name : name.toUpperCase()
    });

    return res.status(201).json(
        new ApiResponse(201 , account_Status ,  "Status created successfully")
    )
});

// update account status
export const updateAccountStatus = asyncHandler( async (req , res) =>{
    const {id} = req.params;
    const {name}  = req.body;

     if(!name){
          throw new ApiError(400 , "All fields are required")
    }

    const searchAccountStatus = await AccountStatus.findById(id);
    if(!searchAccountStatus){
        throw new ApiError(404 , "Account Ststus not found");
    };
   
    //protection logic account Status
    if(PROTECTED_ACCOUNT_STATUSES.includes(searchAccountStatus.name)){
        throw new ApiError(403 , "This Account Status cannot be Updated");
    }

    const duplicate = await AccountStatus.findOne({
    name: name.toUpperCase(),
    _id: { $ne: id },
  });

  if (duplicate) {
    throw new ApiError(409, "Account Status already exists");
  }

    searchAccountStatus.name = name.toUpperCase();
    await searchAccountStatus.save();

    return res.status(200).json(
        new ApiResponse(200 , searchAccountStatus , "Account Status Updated successfully" )
    );
});

// delete  account status
export const deleteAccountStatus = asyncHandler( async (req , res) =>{
    const {id} = req.params;

    const searchAccountStatus =  await AccountStatus.findById(id);

    if(!searchAccountStatus){
        throw new ApiError(404 , "Account Status not found");
    }

    
    //protection Logic Account Ststus
    if(PROTECTED_ACCOUNT_STATUSES.includes(searchAccountStatus.name)){
        throw new ApiError(403 , "This Account Status can not be deleted");
    }

    // Default fallBack = Inactive
    const defaultAccountStatus = await AccountStatus.findOne({name : "INACTIVE"});
     
    if(!defaultAccountStatus){
     throw new ApiError(500 , "Default INACTIVE status not found");
    };

    await User.updateMany(
        { AccountStatus : id} ,
        { $set : {AccountStatus : defaultAccountStatus._id}}
    );
  
    // delete status
    await searchAccountStatus.deleteOne();

    return res.status(200).json(
     new ApiResponse(200 , {} , "Account Status delete successfully")
    );
});

// get all data
export const getAllAccountStatus = asyncHandler( async (req , res) =>{
    const AllAccountStatus = await AccountStatus.find();
    
    return res.status(200).json(
        new ApiResponse(200 , AllAccountStatus , "All Account Status")
    );
});
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";
import { PROTECTED_DEPARTMENT } from "../constants/protected.js";

export const createDepartment = asyncHandler(async (req , res) =>{
    const {name} = req.body;
    
    if(!name){
        throw new ApiError(400 , "fields are required");
    }

    const exists = await Department.findOne({ name : name.toUpperCase() })
    if(exists){
     throw new ApiError(409 , "Department allready exists");
    }

   const newDepartment = await Department.create({
     name : name.toUpperCase()
   })

    return res.status(201).json(
        new ApiResponse(201 , newDepartment , "Department status successfully added")
    )
});

export const updateDepartment = asyncHandler( async (req , res) =>{
    const {id} = req.params;
    const {name} = req.body;

     if(!name){
        throw new ApiError(400 , "fields are required");
    }
    
    const existing = await Department.findById({ name : name.toUpperCase()  ,
        
    });
    if(existing){
        throw new ApiError(404 , "Department role all ready exists")
    }

    if(PROTECTED_DEPARTMENT.includes(existing.name)){
        throw new ApiError(403 , "Department role can not modified");
    }
    
     const duplicate = await Department.findOne({
    name: name.toUpperCase(),
    _id: { $ne: id },
  });

  if (duplicate) {
    throw new ApiError(409, "Department already exists");
  }
  
     existing.name = name.toUpperCase();
     await existing.save();
     
    return res.status(200).json(
        new ApiResponse(200 , existing , "Department role successfully Updated")
    )

})

export const deleteDepartment = asyncHandler( async (req , res) =>{
     const {id} = req.params;

     const existing = await Department.findById(id);
     if(!existing){
        throw new ApiError(404 , "Department not found")
     }

     if(PROTECTED_DEPARTMENT.includes(existing.name)){
        throw new ApiError(403, "Department role can not be deleted ");
     }

     // by default IT department
     const defaultDepartment = await Department.findOne({name : "IT"});
     if(!defaultDepartment){
        throw new ApiError(500 , "default department does not found");
     }

     await User.updateMany(
        {Department : id},
        {$set : {Department : defaultDepartment._id}} 
     )
   
     await existing.deleteOne();

      return res.status(200).json(
     new ApiResponse(200 , {} , "Department Status delete successfully")
    );

})



// get all data
export const getAllDepartmentStatus = asyncHandler( async (req , res) =>{
    const AllDepartmentStatus = await Department.find();
    
    return res.status(200).json(
        new ApiResponse(200 , AllDepartmentStatus , "All Department Status")
    );
});
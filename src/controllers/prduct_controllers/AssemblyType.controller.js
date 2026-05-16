import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { ProductAssemblyType } from "../../models/product_models/AssemblyType.model.js";

export const createProductAssemblyType = asyncHandler( async(req, res) =>{
    const {assembly_name , remark , status} = req.body;

    //validation
    if(!assembly_name || assembly_name.trim() === ""){
        throw new ApiError(400 , "Product Assembly name are required")
    }
    // check existing
     const existing = await ProductAssemblyType.findOne({
        assembly_name : assembly_name.trim()
     })

     if(existing){
        throw new ApiError(409, "Product assembly type already exists");
     }

     const Product_Assembly_data = await ProductAssemblyType.create({
        assembly_name: assembly_name.trim(),
        remark: remark || "",
        status : status || false
     })

     return res.status(201).json( 
        new ApiResponse(201 , Product_Assembly_data , "Product assembly type data create successfully")
     )
})


export const UpdateProductAssemblyType = asyncHandler(async (req , res) =>{
   const {id} = req.params;
   const {assembly_name , remark , status} = req.body;
 
   const searchAssemblyType = await ProductAssemblyType.findById(id);

   if(!searchAssemblyType){
      throw new ApiError(404 , "Assembly type does not exists");
   }

   // dyanamic update object
   const updateData = {};

   if(assembly_name !== undefined){
      if(assembly_name.trim() === ""){
         throw new ApiError(400 , "Assembly Type name cannot be empty");
      }

      // duplicate check 
      const existingAssembly_Type = await ProductAssemblyType.findOne({
         assembly_name : assembly_name.trim(),
         _id : {$ne : id},
      });

      if(existingAssembly_Type){
         throw new ApiError(400 , "Product assembly type already exists");
      }

      updateData.assembly_name = assembly_name.trim();
   }

   if(remark !== undefined){
      updateData.remark = remark;
   }

 if (status !== undefined) {
    updateData.status = status;
  }

  // update
    const updatedAssemblyType = await ProductAssemblyType.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
      
   return res.status(200).json(
    new ApiResponse(200, updatedAssemblyType, "Product assembly type updated successfully")
  );
})

export const getAllProductAssemblyType = asyncHandler(async (req , res) =>{
    const data = await ProductAssemblyType.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Assembly type list fetched successfully"
    )
  );
})

export const deleteProductAssemblyType = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check exists
  const findAssemblyType = await ProductAssemblyType.findById(id);

  if (!findAssemblyType) {
    throw new ApiError(404, "Assembly type not found");
  }

  // delete
  await ProductAssemblyType.findByIdAndDelete(id , {
   status: false
});

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product assembly type deactivated successfully"
    )
  );
});
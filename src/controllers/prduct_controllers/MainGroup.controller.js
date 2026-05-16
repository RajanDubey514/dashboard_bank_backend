import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { ProductGroup } from "../../models/product_models/MainGroup.model.js";

export const createProductGroup = asyncHandler( async(req, res) =>{
    const {group_name , remark , status} = req.body;

    //validation
    if(!group_name || group_name.trim() === ""){
        throw new ApiError(400 , "Product Group name are required")
    }
    // check existing
     const existing = await ProductGroup.findOne({
        group_name : group_name.trim()
     })

     if(existing){
        throw new ApiError(409, "Product Group name already exists");
     }

     const Product_Group_data = await ProductGroup.create({
        group_name: group_name.trim(),
        remark: remark || "",
        status : status || false
     })

     return res.status(201).json( 
        new ApiResponse(201 , Product_Group_data , "Product Group data create successfully")
     )
})

export const UpdateProductGroup = asyncHandler(async (req , res) =>{
   const {id} = req.params;
   const {group_name , remark , status} = req.body;
 
   const searchProductGroup = await ProductGroup.findById(id);

   if(!searchProductGroup){
      throw new ApiError(404 , "Product Group does not exists");
   }

   // dyanamic update object
   const updateData = {};

   if(group_name !== undefined){
      if(group_name.trim() === ""){
         throw new ApiError(400 , "Product group name cannot be empty");
      }

      // duplicate check 
      const existingProduct_Type = await ProductGroup.findOne({
         group_name : group_name.trim(),
         _id : {$ne : id},
      });

      if(existingProduct_Type){
         throw new ApiError(400 , "Product group name already exists");
      }

      updateData.group_name = group_name.trim();
   }

   if(remark !== undefined){
      updateData.remark = remark;
   }

 if (status !== undefined) {
    updateData.status = status;
  }

  // update
    const updatedProductGroup = await ProductGroup.findByIdAndUpdate(
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
    new ApiResponse(200, updatedProductGroup, "Product group updated successfully")
  );
})

export const getAllProductGroup = asyncHandler(async (req , res) =>{
    const data = await ProductGroup.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Product group list fetched successfully"
    )
  );
})

export const deleteProductGroup = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check exists
  const findProductType = await ProductGroup.findById(id);

  if (!findProductType) {
    throw new ApiError(404, "Product group data not found");
  }

  // delete
  await ProductGroup.findByIdAndDelete(id , {
   status: false
});

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product Group deactivated successfully"
    )
  );
});
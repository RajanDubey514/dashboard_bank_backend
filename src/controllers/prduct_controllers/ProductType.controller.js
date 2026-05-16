import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { ProductType } from "../../models/product_models/ProductType.model.js";

export const createProductType = asyncHandler( async(req, res) =>{
    const {product_name , remark , status} = req.body;

    //validation
    if(!product_name || product_name.trim() === ""){
        throw new ApiError(400 , "Product name are required")
    }
    // check existing
     const existing = await ProductType.findOne({
        product_name : product_name.trim()
     })

     if(existing){
        throw new ApiError(409, "Product type already exists");
     }

     const Product_data = await ProductType.create({
        product_name: product_name.trim(),
        remark: remark || "",
        status : status || false
     })

     return res.status(201).json( 
        new ApiResponse(201 , Product_data , "Product type data create successfully")
     )
})

export const UpdateProductType = asyncHandler(async (req , res) =>{
   const {id} = req.params;
   const {product_name , remark , status} = req.body;
 
   const searchProductType = await ProductType.findById(id);

   if(!searchProductType){
      throw new ApiError(404 , "Product type does not exists");
   }

   // dyanamic update object
   const updateData = {};

   if(product_name !== undefined){
      if(product_name.trim() === ""){
         throw new ApiError(400 , "Product Type name cannot be empty");
      }

      // duplicate check 
      const existingProduct_Type = await ProductType.findOne({
         product_name : product_name.trim(),
         _id : {$ne : id},
      });

      if(existingProduct_Type){
         throw new ApiError(400 , "Product type already exists");
      }

      updateData.product_name = product_name.trim();
   }

   if(remark !== undefined){
      updateData.remark = remark;
   }

 if (status !== undefined) {
    updateData.status = status;
  }

  // update
    const updatedProductType = await ProductType.findByIdAndUpdate(
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
    new ApiResponse(200, updatedProductType, "Product type updated successfully")
  );
})

export const getAllProductType = asyncHandler(async (req , res) =>{
    const data = await ProductType.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Product type list fetched successfully"
    )
  );
})

export const deleteProductType = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check exists
  const findProductType = await ProductType.findById(id);

  if (!findProductType) {
    throw new ApiError(404, "Product type data not found");
  }

  // delete
  await ProductType.findByIdAndDelete(id , {
   status: false
});

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Product type deactivated successfully"
    )
  );
});
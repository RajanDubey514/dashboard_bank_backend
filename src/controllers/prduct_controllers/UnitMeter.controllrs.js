import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { UnitOfMeter } from "../../models/product_models/UnitMeter.model.js";

export const createUnitMeter = asyncHandler( async(req, res) =>{
    const {uom_name , remark , status} = req.body;
    //validation
    if(!uom_name || uom_name.trim() === ""){
        throw new ApiError(400 , "UOM name are required")
    }
    // check existing
     const existing = await UnitOfMeter.findOne({
        uom_name : uom_name.trim()
     })

     if(existing){
        throw new ApiError(409, "UOM already exists");
     }

     const UOM_data = await UnitOfMeter.create({
        uom_name: uom_name.trim(),
        remark: remark || "",
        status : status || false
     })

     return res.status(201).json( 
        new ApiResponse(201 , UOM_data , "UOM Create successfully")
     )
})

export const UpdateUnitMeter = asyncHandler(async (req , res) =>{
   const {id} = req.params;
   const {uom_name , remark , status} = req.body;
 
   const searchUOM = await UnitOfMeter.findById(id);

   if(!searchUOM){
         throw new ApiError(404 , "UOM does not exists");
   }

   // dyanamic update object
   const updateData = {};

   if(uom_name !== undefined){
      if(uom_name.trim() === ""){
         throw new ApiError(400 , "UOM name cannot be empty");
      }

      // duplicate check 
      const existingUOM = await UnitOfMeter.findOne({
         uom_name : uom_name.trim(),
         _id : {$ne : id},
      });

      if(existingUOM){
         throw new ApiError(400 , "UOM already exists");
      }

      updateData.uom_name = uom_name.trim();
   }

   if(remark !== undefined){
      updateData.remark = remark;
   }

 if (status !== undefined) {
    updateData.status = status;
  }

  // update
    const updatedUOM = await UnitOfMeter.findByIdAndUpdate(
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
    new ApiResponse(200, updatedUOM, "UOM updated successfully")
  );
})

export const getAllUnitMeter = asyncHandler(async (req , res) =>{
    const data = await UnitOfMeter.find().sort({ createdAt: -1 });
  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "UOM list fetched successfully"
    )
  );
})

export const deleteUnitMeter = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check exists
  const findUOM = await UnitOfMeter.findById(id);

  if (!findUOM) {
    throw new ApiError(404, "UOM not found");
  }

  // delete
  await UnitOfMeter.findByIdAndDelete(id , {
   status: false
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "UOM deactivated successfully"
    )
  );
});
import asyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";

import { ProductGroup } from "../../models/product_models/MainGroup.model.js";
import { ProductSubGroup } from "../../models/product_models/SubGroup.model.js";

export const createProductSubGroup = asyncHandler(async (req , res) =>{
    const { group_name , sub_group_name, remark, status} = req.body;

    // validation 
    if(!group_name){
        throw new ApiError(400, "Main Group name is required");
    }

      if (!sub_group_name || sub_group_name.trim() === "") {
      throw new ApiError(400, "Sub Group name is required");
     }

     // check main group exists
     const findMainGroup = await ProductGroup.findById(group_name);

     if(!findMainGroup){
        throw new ApiError(404, "Main Group not found");
     }

     // check main group active or not
     if(findMainGroup.status === false){
        throw new ApiError(400, "Main Group is not active");
     }

      // duplicate check
    const existingSubGroup = await ProductSubGroup.findOne({
        sub_group_name: sub_group_name.trim(),
    });

    if (existingSubGroup) {
        throw new ApiError(409, "Sub Group name already exists");
    }

    // create subGroup 
    const createSubGroup = await ProductSubGroup.create({
        group_name , 
        sub_group_name : sub_group_name.trim(),
        remark : remark || "",
        status : status || false,
    });

     return res.status(201).json(
    new ApiResponse(
      201,
      createSubGroup,
      "Sub Group created successfully"
    )
  );
})

export const updateProductSubGroup = asyncHandler(async (req , res) =>{
    const {id} = req.params;
    const { group_name, sub_group_name, remark, status } = req.body;
    
    //check subgroup esists 
    const findSubGroup = await ProductSubGroup.findById(id);

    if(!findSubGroup){
        throw new ApiError(404, "Sub Group not found");
    }

    // dynamic update object
    const updateData = {};

    // update main group
    if(group_name !== undefined){
        const findMainGroup = await ProductGroup.findById(group_name);

        if(!findMainGroup){
           throw new ApiError(404, "Main Group not found");
        }

        // check active or not
        if (findMainGroup.status === false) {
        throw new ApiError(400, "Main Group is not active");
        }

        updateData.group_name = group_name;
    }

    // update subGroup name
    if(sub_group_name !== undefined){

            if (sub_group_name.trim() === "") {
      throw new ApiError(400, "Sub Group name cannot be empty");
    }

    // duplicate check
    const existingSubGroup = await ProductSubGroup.findOne({
      sub_group_name: sub_group_name.trim(),
      _id: { $ne: id },
    });
     
     if (existingSubGroup) {
      throw new ApiError(409, "Sub Group name already exists");
    }

    updateData.sub_group_name = sub_group_name.trim();
    }
   

      // update remark
    if (remark !== undefined) {
        updateData.remark = remark;
    }

    // update status
    if (status !== undefined) {
        updateData.status = status;
    }
   
     // update data
  const updatedSubGroup = await ProductSubGroup.findByIdAndUpdate(
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
    new ApiResponse(
      200,
      updatedSubGroup,
      "Sub Group updated successfully"
    )
  );

})

export const getAllProductSubGroup = asyncHandler(async (req, res) => {

  const data = await ProductSubGroup.find()
    .populate("group_name", "group_name")
    .select("-__v")
    .lean()
    .sort({ createdAt: -1 });

  const formattedData = data.map(({ group_name, ...rest }) => ({
    ...rest,
    group_name: group_name?.group_name || "",
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      formattedData,
      "Sub Group list fetched successfully"
    )
  );
});

export const deleteProductSubGroup = asyncHandler(async (req, res) => {

  const { id } = req.params;

  // check subgroup exists
  const findSubGroup = await ProductSubGroup.findById(id);

  if (!findSubGroup) {
    throw new ApiError(404, "Sub Group not found");
  }

  // delete subgroup
  await ProductSubGroup.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Sub Group deleted successfully"
    )
  );
});
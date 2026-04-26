import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { AccountStatus } from "../models/accountStatus.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

export const getAllUsers = asyncHandler(async (req , res) =>{
    const {status} = req.query;
    let filter = {};
    // agar status query aayi (ACTIVE / INACTIVE)
    if(status){
        const statusDoc = await AccountStatus.findOne({
            name : status.toUpperCase(),
        });

        if(!statusDoc){
            throw new ApiError(400 , "Invalid status");
        }

        filter.accountStatus = statusDoc._id;
    } 

    const user = await User.find(filter)
      .select("-password")
    .populate("role")
    .populate("department")
    .populate("accountStatus")
    .sort({ createdAt: -1 });

     return res.status(200).json(
    new ApiResponse(200, user, "Users fetched successfully")
  );

})


export const toggleUserStatus = asyncHandler(async (req , res) =>{
    const {id} = req.params ;
    const {status} = req.body; // ACTIVE / INACTIVE

    if(!status){
        throw new ApiError(400 , "Status is required");
    }

    const statusDoc = await AccountStatus.findOne({
        name : status.toUpperCase(),
    });

    if(!statusDoc){
        throw new ApiError(400 , "Invalid Status");
    }

    const user = await User.findByIdAndUpdate(
        id , 
        { accountStatus : statusDoc._id},
        {new : true}
    )
    .select("-password")
    .populate("role department accountStatus");


     if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user, `User ${status} successfully`)
  );
})

export const getMyProfile = asyncHandler(async (req, res) =>{
    const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate("role department accountStatus")
   

    if(!user){
        throw new ApiError(404 , "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200 , user , "profile fetch successfully")
    );
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const { fullName, location, bio } = req.body;

  // build update object dynamically
  const updateFields = {};

  if (fullName) updateFields.fullName = fullName.trim();
  if (location) updateFields.location = location.trim();
  if (bio) updateFields.bio = bio.trim();

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No data provided to update");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  )
    .select("-password")
    .populate("role department accountStatus");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "Profile updated successfully")
  );
});

export const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadCloudinary(avatarLocalPath);

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Avatar updated successfully")
  );
});

export const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;

  if (!coverLocalPath) {
    throw new ApiError(400, "Cover image is missing");
  }

  const coverImage = await uploadCloudinary(coverLocalPath);

  if (!coverImage || !coverImage.url) {
    throw new ApiError(400, "Error while uploading cover image");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(200, user, "Cover image updated successfully")
  );
});
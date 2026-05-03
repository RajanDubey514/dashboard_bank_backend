import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { AccountStatus } from "../models/accountStatus.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { Role } from "../models/role.model.js";
import { Department } from "../models/department.model.js";

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

    // const user = await User.find(filter)
    //   .select("-password")
    // .populate("role")
    // .populate("department")
    // .populate("accountStatus")
    // .sort({ createdAt: -1 });

      // 🔹 FETCH USERS
  const users = await User.find(filter)
    .select("-password -refreshToken")
    .populate({ path: "role", select: "name" })
    .populate({ path: "department", select: "name" })
    .populate({ path: "accountStatus", select: "name" })
    .sort({ createdAt: -1 });

  // 🔥 FORMAT DATA (IMPORTANT)
  const formattedUsers = users.map((user) => ({
    ...user.toObject(),
    role: user.role?.name,
    department: user.department?.name,
    accountStatus: user.accountStatus?.name,
  }));
    
     return res.status(200).json(
    new ApiResponse(200, formattedUsers, "Users fetched successfully")
  );

})

export const updateRegisterUser = asyncHandler(async (req , res) =>{
    const {id} = req.params ;
    const { fullName , email , phone , username , role, department , accountStatus } = req.body; 
     
    const user = await User.findById(id);
    if(!user){
        throw new ApiError(404 , "User Not Found");
    }

     // 🔹 Email validation (if provided)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }
       const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      throw new ApiError(409, "Email already in use");
    }

    user.email = email;
  }

 // 🔹 Username check
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername && existingUsername._id.toString() !== id) {
      throw new ApiError(409, "Username already in use");
    }

    user.username = username;
  }

  // 🔹 Simple fields
  if (fullName) user.fullName = fullName;
  if (phone) user.phone = phone;

  // 🔹 Role
  if (role) {
    const roleData = await Role.findById(role);
    if (!roleData) throw new ApiError(400, "Invalid role");
    user.role = roleData._id;
  }

  // 🔹 Department
  if (department) {
    const departmentData = await Department.findById(department);
    if (!departmentData) throw new ApiError(400, "Invalid department");
    user.department = departmentData._id;
  }

  // 🔹 Status
  if (accountStatus) {
    const statusData = await AccountStatus.findById(accountStatus);
    if (!statusData) throw new ApiError(400, "Invalid status");
    user.accountStatus = statusData._id;
  }

  await user.save();

  const updatedUser = await User.findById(id)
    .select("-password")
    .populate({ path: "role", select: "name -_id" })
    .populate({ path: "department", select: "name -_id" })
    .populate({ path: "accountStatus", select: "name -_id" });

  const formattedUser = {
    ...updatedUser.toObject(),
    role: updatedUser.role?.name,
    department: updatedUser.department?.name,
    accountStatus: updatedUser.accountStatus?.name,
  };

  return res.status(200).json(
    new ApiResponse(200, formattedUser, "User updated successfully")
  );
})

export const getMyProfileInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refreshToken")
    .populate({ path: "role", select: "name" })
    .populate({ path: "department", select: "name" })
    .populate({ path: "accountStatus", select: "name" });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ FORMAT SINGLE USER
  const formattedUser = {
    ...user.toObject(),
    role: user.role?.name,
    department: user.department?.name,
    accountStatus: user.accountStatus?.name,
  };

  return res.status(200).json(
    new ApiResponse(200, formattedUser, "profile fetch successfully")
  );
});


export const updateMyProfileInfo = asyncHandler(async (req, res) => {
  const { phone, location, bio } = req.body;

  // build update object dynamically
  const updateFields = {};

  if (phone) updateFields.phone = phone.trim();
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
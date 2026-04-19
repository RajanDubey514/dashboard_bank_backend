import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Department } from "../models/department.model.js";
import { AccountStatus } from "../models/accountStatus.model.js";

export const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    username,
    password,
    confirmPassword,
  } = req.body;

  // validation
  if (
    !fullName ||
    !email ||
    !phone ||
    !username ||
    !password ||
    !confirmPassword
  ) {
    throw new ApiError(400, "All required fields must be filled");
  }
   
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  throw new ApiError(400, "Invalid email format");
}
 
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

if (!passwordRegex.test(password)) {
  throw new ApiError(
    400,
    "Password must be at least 8 characters, include one uppercase letter and one special character"
  );
} 

  // password match
  if (password !== confirmPassword) {
    throw new ApiError(400, "password do not match");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }, { phone }],
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }
 
  const userCount = await User.countDocuments();

  const roleName = userCount === 0 ? "SUPER_ADMIN" : "USER";

  const roleData = await Role.findOne({ name : roleName});
  const departmentData = await Department.findOne({ name : "IT"});
  const statusData = await AccountStatus.findOne({ name : "ACTIVE"});

  if( !roleData || !departmentData || !statusData){
    throw new ApiError(500 , "Seed Data missing");
  }


  // Create user
  const user = await User.create({
    fullName,
    email,
    phone,
    department : departmentData._id,
    role : roleData._id,
    accountStatus : statusData._id,
    username,
    password,
  });


  const populatedUser = await User.findById(user._id).populate("role");

  // Generate token
  const token = populatedUser.generateAccessToken(populatedUser.role.name);

  // ❌ remove password from response
  const createdUser = await User.findById(user._id).select("-password")
  .populate("role")
  .populate("department")
  .populate("accountStatus");

  // response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        token,
      },
      "User registered successfully",
    ),
  );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  if (!password) {
    throw new ApiError(400, "password is required");
  }

  const user = await User.findOne({email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  
  const populatedUser = await User.findById(user._id).populate("role");

  const token = populatedUser.generateAccessToken(populatedUser.role.name);

  // remove password
  const loggedInUser = await User.findById(user._id)
  .select("-password")
  .populate("role")
  .populate("department")
  .populate("accountStatus");

  //return resp
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        token,
      },
      "User Logged in successfully",
    ),
  );
});

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Department } from "../models/department.model.js";
import { AccountStatus } from "../models/accountStatus.model.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, username, password, confirmPassword } =
    req.body;

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

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters, include one uppercase letter and one special character",
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

  const roleData = await Role.findOne({ name: roleName });
  const departmentData = await Department.findOne({ name: "IT" });
  const statusData = await AccountStatus.findOne({ name: "ACTIVE" });

  if (!roleData || !departmentData || !statusData) {
    throw new ApiError(500, "Seed Data missing");
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    phone,
    department: departmentData._id,
    role: roleData._id,
    accountStatus: statusData._id,
    username,
    password,
  });

  const populatedUser = await User.findById(user._id).populate("role");

  // Generate token
  const token = populatedUser.generateAccessToken(populatedUser.role.name);

  // ❌ remove password from response
  const createdUser = await User.findById(user._id)
    .select("-password")
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

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const populatedUser = await User.findById(user._id).populate("role");

  const token = populatedUser.generateAccessToken(populatedUser.role.name);
  const refreshToken = populatedUser.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // remove password
  const loggedInUser = await User.findById(user._id)
    .select("-password")
    .populate("role")
    .populate("department")
    .populate("accountStatus");

  //return resp
  return res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
       sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
       sameSite: "none",
    })
    .json(
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

export const logoutUser = asyncHandler(async (req, res) => {
  // refreshToken DB se hatao
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    { new: true },
  );

  // cookies clear karo
  return res
    .status(200)
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
       sameSite: "none",
    })
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
       sameSite: "none",
    })
    .json(new ApiResponse(200, {}, "logout successful"));
});

// export const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   const resetToken = user.generateResetToken();
//   await user.save({
//     validateBeforeSave: false,
//   });

//   const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     to: user.email,
//     subject: "Password Reset",
//     text: `Click here to reset password : ${resetUrl}`,
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Reset link sent to email"));
// });

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. Check user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 2. Generate reset token
  const resetToken = user.generateResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  // 3. Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // 4. Send email using your util
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click here to reset your password: ${resetUrl}`,
    });
  } catch (error) {
    // console.log(error , "hhhhhhh")
    // rollback token if email fails
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, "Email could not be sent");
  }

  // 5. Response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Reset link sent to email"));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters, include one uppercase letter and one special character",
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Token invalid or expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successful"));
});

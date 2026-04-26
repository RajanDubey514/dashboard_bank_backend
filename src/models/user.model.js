import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Department",
      required : true
      
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Role",
      required: true,
    },

    accountStatus: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "AccountStatus",
      required : true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
     type: String,
     },

      coverImage: {
        type: String,
      },

      location: {
        type: String,
      },

      bio: {
        type: String,
        maxlength: 200,
      },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);


userSchema.add({
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});


//hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return ;

  this.password = await bcrypt.hash(this.password, 10);
  // next();
});

// compare password (for login later)
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// json web token
userSchema.methods.generateAccessToken = function (roleName) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: roleName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:  process.env.JWT_EXPIERD,
    },
  );
};

userSchema.methods.generateRefreshToken = function(){
 return jwt.sign(
    {
      _id : this._id,
    },
    process.env.REFRESH_SECRET , 
     { 
      expiresIn: process.env.REFRESH_EXPIERD 
    }
 );
};

userSchema.methods.generateResetToken = function(){
  const token = crypto.randomBytes(32).toString("hex");
  
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000 ;

  return token;
};


export const User = mongoose.model("User", userSchema);

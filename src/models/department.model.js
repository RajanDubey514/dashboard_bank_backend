import mongoose, { Types } from "mongoose";
const departmentSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true,
        unique : true,
        uppercase : true,
        trim : true
    },
} ,{timestamps : true}
);

export const Department = mongoose.model("Department" , departmentSchema)
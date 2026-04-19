import mongoose from "mongoose";

const accountStatusSchema = new mongoose.Schema({
    name : {
     type : String,
     required : true,
     unique : true ,
     trim : true,
     uppercase : true,
    }
}, {
    timestamps : true
})

export const AccountStatus = mongoose.model("AccountStatus" , accountStatusSchema)
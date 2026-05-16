import mongoose from "mongoose";
const mainGroupSchema = new mongoose.Schema({
    group_name:{
     type : String,
     required : true,
     unique : true ,
     trim : true,
    },
    remark:{
      type : String ,
    },
    status:{
      type : Boolean ,
    }
}, {timestamps : true
})

export const ProductGroup = mongoose.model("ProductGroup" , mainGroupSchema)


import mongoose from "mongoose";
const productTypeSchema = new mongoose.Schema({
    product_name:{
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

export const ProductType = mongoose.model("ProductType" , productTypeSchema)


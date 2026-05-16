import mongoose from "mongoose";

const subGroupSchema = new mongoose.Schema({
    sub_group_name:{
     type : String,
     required : true,
     unique : true ,
     trim : true,
    },
    group_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductGroup",
      required: true,
    },

    remark:{
      type : String ,
    },
    status:{
      type : Boolean ,
    }
}, {timestamps : true
})

export const ProductSubGroup = mongoose.model("ProductSubGroup" , subGroupSchema)


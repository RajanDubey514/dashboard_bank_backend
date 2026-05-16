import mongoose from "mongoose";
const assemblyTypeSchema = new mongoose.Schema({
    assembly_name:{
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

export const ProductAssemblyType = mongoose.model("ProductAssemblyType" , assemblyTypeSchema)


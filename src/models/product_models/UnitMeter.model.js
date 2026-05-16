import mongoose from "mongoose";
const unitMeterSchema = new mongoose.Schema({
    uom_name:{
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

export const UnitOfMeter = mongoose.model("UOM" , unitMeterSchema)

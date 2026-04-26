import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import app from "./app.js";


connectDB().then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running on PORT : ${process.env.PORT}`); 
    })
}).catch((err)=>{
    console.log("db connection failed" , err)
})
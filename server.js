import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./app.js";

dotenv.config();

connectDB().then(()=>{
    app.listen(process.env.PORT || 5000 , ()=>{
        console.log(`Server is running on PORT : ${process.env.PORT}`); 
    })
}).catch((err)=>{
    console.log("db connection failed" , err)
})
import express from "express";
import cors  from "cors";
import cookieParser from "cookie-parser";
import account_status from "./src/routes/accountStatus.routes.js"
import errorHandler from "./src/middlewares/error.middleware.js";
import userRoutes from "./src/routes/user.routes.js";
import accountStatus  from "./src/routes/accountStatus.routes.js";
import roleStatus from "./src/routes/role.routes.js"
import departmentStatus from "./src/routes/department.routes.js"
import allUser from './src/routes/allUser.routes.js'

const app = express();

// app.use(
//     cors({
//         origin : process.env.CORS_ORIGIN,
//         credentials : true
//     }));
   
 const allowedOrigins = [
  "http://localhost:3001", // local
  "https://hilarious-sable-72cc78.netlify.app" // tera frontend
];
   app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / mobile apps ke liye
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


    app.use(express.json());
    app.use(express.urlencoded({
        extended : true
    }));
    app.use(cookieParser());


    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/account_status" , accountStatus);
    app.use("/api/v1/role" , roleStatus);
    app.use("/api/v1/department" , departmentStatus);
    app.use("/api/v1/all" , allUser)


    app.use(errorHandler);

    export default app ;

 

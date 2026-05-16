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
import unitOfMeter from './src/routes/product_routes/UnitMeter.routes.js'
import assemblyType from './src/routes/product_routes/AssemblyType.routes.js'
import ProductType from './src/routes/product_routes/ProductType.routes.js'
import MainGroup from './src/routes/product_routes/MainGroup.routes.js'
import SubGroup from './src/routes/product_routes/SubGroup.routes.js'
import Product from './src/routes/product_routes/Product.routes.js'

const app = express();

const allowedOrigins = [
  "https://mellifluous-kataifi-1bc8e7.netlify.app",
];

// localhost dynamic allow (ANY port)
const isLocalhost = (origin) => {
  return /^http:\/\/localhost:\d+$/.test(origin);
};

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || isLocalhost(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed: " + origin));
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
    app.use("/api/v1/all" , allUser);


    //product all routes
    app.use("/api/v1/product" , Product );
    app.use("/api/v1/product/uom" , unitOfMeter);
    app.use("/api/v1/product/assemblyType" , assemblyType);
    app.use("/api/v1/product/productType" , ProductType);
    app.use("/api/v1/product/mainGroup" , MainGroup );
    app.use("/api/v1/product/subGroup" , SubGroup );




    app.use(errorHandler);

    export default app ;

 

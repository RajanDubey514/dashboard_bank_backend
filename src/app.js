import express from "express";
import cors  from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(
    cors({
        origin : "*",
        credentials : true
    }));

    app.use(express.json());
    app.use(express.urlencoded({
        extended : true
    }));
    app.use(cookieParser());




    app.use("/api/v1/users", userRoutes);

    app.use(errorHandler);

    export default app ;

 

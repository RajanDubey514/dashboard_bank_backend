import express from "express";
import CORS from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    CORS({
        origin : "*",
        Credential : true
    }));

    app.use(express.json());
    app.use(express.urlencoded({
        extended : true
    }));
    app.use(cookieParser());

    export default app ;

 

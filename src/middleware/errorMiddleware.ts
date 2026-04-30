
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { StatusCode } from "../types";


// config
dotenv.config();


const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

  const isProd: boolean = process.env.NODE_ENV === "production";

  const statusCode = err?.statusCode || StatusCode.INTERNAL_SERVER_ERROR;

  const message = err?.message || "Internal Server Error";




  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: isProd ? null : err.stack
  });


};

export default errorMiddleware;
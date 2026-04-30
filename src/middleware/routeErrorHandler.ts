import { NextFunction, Request, Response } from "express";
import { errRes } from "../errorHandlers/errorUtils";
import { StatusCode } from "../types";


// catch requests to wrong routes

const routeErrorHandler = (req: Request, res: Response, next: NextFunction) => {

  next(errRes(
    `Route '${req.method} ${req.originalUrl}' is wrong!`,
    StatusCode.NOT_FOUND
  ));

};


export default routeErrorHandler;
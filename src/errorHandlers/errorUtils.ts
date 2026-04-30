import { QueryError } from "mysql2";
import ErrorHandler from "./errorHandler";
import mysqlErrorHandler from "./mysqlErrorHandler";
import { StatusCode } from "../types";



// return err obj
const errRes = (message: string, status: number): ErrorHandler => {
  return new ErrorHandler({ message, status });
};



// check if error from MySQL or normal
const errRouter = (err: unknown, fallbackMessage: string): ErrorHandler => {

  // check for mysql2 err (has "code" prop)
  if (err && typeof err === "object" && "code" in err && typeof (err as any).code === "string") {
    return mysqlErrorHandler(err as QueryError);
  }

  if (err instanceof Error) {
    return errRes(err.message, StatusCode.INTERNAL_SERVER_ERROR);
  }

  return errRes(fallbackMessage, StatusCode.INTERNAL_SERVER_ERROR);

};


export { errRes, errRouter };

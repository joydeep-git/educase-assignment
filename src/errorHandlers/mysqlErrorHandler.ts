import { QueryError } from "mysql2";
import { StatusCode } from "../types";
import ErrorHandler from "./errorHandler";



// Centralized MySQL error handler
// Maps mysql2 error codes to HTTP status codes


const mysqlErrorHandler = (err: QueryError): ErrorHandler => {

  let status: number;
  let message: string;


  switch (err.code) {

    // duplicate entry - same value 2 time
    case "ER_DUP_ENTRY":
      status = StatusCode.CONFLICT;
      message = "Duplicate value — a record with this unique field already exists";
      break;

    // Foreign key error - linked table or row missing
    case "ER_NO_REFERENCED_ROW":
    case "ER_NO_REFERENCED_ROW_2":
      status = StatusCode.NOT_FOUND;
      message = "Foreign key constraint failed — referenced record does not exist";
      break;

    // value is getting used by another table
    case "ER_ROW_IS_REFERENCED":
    case "ER_ROW_IS_REFERENCED_2":
      status = StatusCode.CONFLICT;
      message = "Cant delete because another table is using this valie";
      break;

    // not null error - required field with null
    case "ER_BAD_NULL_ERROR":
      status = StatusCode.BAD_REQUEST;
      message = "Value cant be empty!";
      break;

    // too much data in a column
    case "ER_DATA_TOO_LONG":
      status = StatusCode.BAD_REQUEST;
      message = "More data than allowed length!";
      break;

    // out of range error
    case "ER_WARN_DATA_OUT_OF_RANGE":
      status = StatusCode.BAD_REQUEST;
      message = "Value is out of range for this column!";
      break;

    // not column found
    case "ER_BAD_FIELD_ERROR":
      status = StatusCode.BAD_REQUEST;
      message = "Column does not exist!";
      break;

    // no table found
    case "ER_NO_SUCH_TABLE":
      status = StatusCode.NOT_FOUND;
      message = "Database table does not exist!";
      break;

    // syntax error
    case "ER_PARSE_ERROR":
      status = StatusCode.BAD_REQUEST;
      message = "Syntax error";
      break;

    // too many connections
    case "ER_TOO_MANY_USER_CONNECTIONS":
    case "ER_CON_COUNT_ERROR":
      status = StatusCode.INTERNAL_SERVER_ERROR;
      message = "Too many database connections!";
      break;

    // access denied
    case "ER_ACCESS_DENIED_ERROR":
      status = StatusCode.INTERNAL_SERVER_ERROR;
      message = "Database access denied!";
      break;

    // disconnect
    case "PROTOCOL_CONNECTION_LOST":
    case "ECONNREFUSED":
      status = StatusCode.INTERNAL_SERVER_ERROR;
      message = "Database connection lost!";
      break;

    default:
      status = StatusCode.INTERNAL_SERVER_ERROR;
      message = "Database error! Please try again";
      break;

  }


  return new ErrorHandler({
    status,
    message: err.message || message,
  });

};

export default mysqlErrorHandler;
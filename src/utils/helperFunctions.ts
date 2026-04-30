import { Request } from "express";
import { errRes } from "../errorHandlers/errorUtils";
import { StatusCode } from "../types";





// Email format validator
export const isValidEmail = (email: string): boolean => {
  const re: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return re.test(email);
};


// check values
export const fieldValidator = ({ req, validateAll, isQuery = false }: { req: Request; validateAll: boolean; isQuery?: boolean }): { lat: number, lng: number } => {

  // choose the right source: query params (GET) vs body (POST)
  const source = isQuery ? req.query : req.body;

  let fields: string[] = [];

  if (validateAll) {
    fields = ["name", "address", "latitude", "longitude"];
  } else {
    fields = ["latitude", "longitude"];
  }

  for (const field of fields) {

    const val = source[field];

    if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
      throw errRes(`'${field}' is required`, StatusCode.BAD_REQUEST);
    }

  }


  const lat = parseFloat(source.latitude as string);
  if (isNaN(lat) || lat < -90 || lat > 90) {
    throw errRes("latitude must be a number between -90 and 90", StatusCode.BAD_REQUEST);
  }


  const lng = parseFloat(source.longitude as string);
  if (isNaN(lng) || lng < -180 || lng > 180) {
    throw errRes("longitude must be a number between -180 and 180", StatusCode.BAD_REQUEST);
  }

  return { lat, lng };

}
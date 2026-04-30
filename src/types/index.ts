
// HTTP Status codes
export enum StatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500
}



// School data for DB
export interface SchoolDataType {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}



// School with calculated distance
export interface SchoolWithDistanceType extends SchoolDataType {
  distance_km: number;
}



// for creating a new school
export type CreateSchoolType = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

import { NextFunction, Request, Response } from "express";
import { StatusCode, SchoolDataType, SchoolWithDistanceType } from "../types";
import { fieldValidator } from "../utils/helperFunctions";
import schoolModel from "../models/schoolModel";
import { errRouter } from "../errorHandlers/errorUtils";



class SchoolController {



  public async addSchool(req: Request, res: Response, next: NextFunction) {

    try {

      const { name, address } = req.body;

      // checking values
      const { lat, lng } = fieldValidator({ req, validateAll: true });

      const newSchool: SchoolDataType = await schoolModel.addSchool({
        name: name.trim(),
        address: address.trim(),
        latitude: lat,
        longitude: lng,
      });

      return res.status(StatusCode.CREATED).json({
        success: true,
        message: "School added successfully!",
        data: newSchool,
      });

    } catch (err) {
      return next(errRouter(err, "Error adding school"));
    }

  }



  public async listSchools(req: Request, res: Response, next: NextFunction) {

    try {

      // checking only lat-lng values
      const { lat, lng } = fieldValidator({ req, validateAll: false, isQuery: true });

      // db calculate the distance and return sorted data
      const schools: SchoolWithDistanceType[] = await schoolModel.getSchoolsSortedByDistance(lat, lng);

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Schools sorted by distance",
        count: schools.length,
        data: schools,
      });

    } catch (err) {
      return next(errRouter(err, "Error fetching schools"));
    }

  }


}


const schoolController = new SchoolController();

export default schoolController;

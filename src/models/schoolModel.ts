import mysql from "../config/mysql";
import { CreateSchoolType, SchoolDataType, SchoolWithDistanceType } from "../types";



class SchoolModel {


  // free MySQL stops after few min of inactivity, so we need to keep it alive
  public async keepAlive() {

    await mysql.db.query("SELECT 1");

  }


  // add school into database
  public async addSchool({ name, address, latitude, longitude }: CreateSchoolType): Promise<SchoolDataType> {

    const [result]: any = await mysql.db.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    // return new created school
    const [rows]: any = await mysql.db.query(
      "SELECT * FROM schools WHERE id = ?",
      [result.insertId]
    );

    return rows[0] as SchoolDataType;

  }



  // get all schools sorted by distance
  public async getSchoolsSortedByDistance(lat: number, lng: number): Promise<SchoolWithDistanceType[]> {

    const [rows] = await mysql.db.query(
      `SELECT id, name, address, latitude, longitude, CONCAT(ROUND(distance_raw, 2), ' km') AS distance
      FROM (
         SELECT *,
           (6371 * ACOS(
            COS(RADIANS(?)) * COS(RADIANS(latitude)) *
            COS(RADIANS(longitude) - RADIANS(?)) +
            SIN(RADIANS(?)) * SIN(RADIANS(latitude))
          )) AS distance_raw
        FROM schools
      ) AS ranked
      ORDER BY distance_raw ASC`,
      [lat, lng, lat]
    );

    return rows as SchoolWithDistanceType[];

  }


}


const schoolModel = new SchoolModel();

export default schoolModel;

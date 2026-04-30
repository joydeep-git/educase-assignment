import dotenv from "dotenv";
import mysql2, { Pool, PoolConnection, QueryError } from "mysql2/promise";
import mysqlErrorHandler from "../errorHandlers/mysqlErrorHandler";
import { StatusCode } from "../types";
import { errRes } from "../errorHandlers/errorUtils";


// load env
dotenv.config();


class MySQL {

  public db: Pool;


  constructor() {

    try {

      // connect
      this.db = mysql2.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string, 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });


      // get connectin errors
      this.db.pool.on("error", (err: QueryError) => {

        console.error("MySQL Pool Error:", err.code, err.message);

        const handledError = mysqlErrorHandler(err);

        console.error("Handled:", handledError);

        process.exit(1); // close if db fails

      });


      // create tables on start
      this.createTables();


    } catch (err) {

      if (err && typeof err === "object" && "code" in err) {

        mysqlErrorHandler(err as QueryError);

      } else {

        throw errRes("Failed to create MySQL connection pool", StatusCode.INTERNAL_SERVER_ERROR);

      }

      process.exit(1);

    }

  }



  // create school tables if it doesnt exist
  private async createTables() {

    let connection: PoolConnection | null = null;

    try {

      connection = await this.db.getConnection();

      await connection.query(`
        CREATE TABLE IF NOT EXISTS schools (
          id          INT AUTO_INCREMENT PRIMARY KEY,
          name        VARCHAR(255) NOT NULL,
          address     VARCHAR(255) NOT NULL,
          latitude    FLOAT        NOT NULL,
          longitude   FLOAT        NOT NULL
        )
      `);


    } catch (err) {

      if (err && typeof err === "object" && "code" in err) {

        console.error("Table creation error:", mysqlErrorHandler(err as QueryError));

      } else {

        throw errRes("Error creating table", StatusCode.INTERNAL_SERVER_ERROR);

      }

    } finally {

      // release connection to pool
      if (connection) connection.release();

    }

  }

}


const mysql = new MySQL();

export default mysql;
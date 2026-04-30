import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import errorMiddleware from "./middleware/errorMiddleware";
import routeErrorHandler from "./middleware/routeErrorHandler";
import schoolRouter from "./routers/schoolRouter";

// create table on start
import "./config/mysql";


class Server {

  private app: Application;

  private port: number;


  constructor() {

    dotenv.config();

    this.app = express();

    this.port = Number(process.env.PORT) || 5678;

    this.runServer();

  }


  // adding all middleware and routes one by one
  private runServer() {

    try {

      this.middlewareConfig();

      this.createRoutes();

      this.errorMiddlewareConfig();

      this.startServer();

    } catch (err) {

      console.error("Failed to start server:", err);
      process.exit(1);

    }

  }



  private middlewareConfig() {

    this.app.use(
      cors({
        origin: process.env.NODE_ENV === "production"
          ? process.env.ALLOWED_ORIGIN || "*"
          : "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: false
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }




  private createRoutes() {

    // school routes
    this.app.use("/api", schoolRouter);

    this.app.get("/api/test", (_req: Request, res: Response) => {
      return res.status(200).json({
        message: "OK!",
      })
    })

  }



  // error handling middleware
  private errorMiddlewareConfig() {

    this.app.use(routeErrorHandler);

    this.app.use(errorMiddleware);

  }



  private startServer() {

    this.app.listen(this.port, () => {
      console.log(`Server is running on => ${this.port}`);
    });

  }

}


new Server();

import express, { Router } from "express";
import schoolController from "../controllers/schoolController";



class SchoolRouter {

  public router: Router = express.Router();


  constructor() {

    this.router.post("/addSchool", schoolController.addSchool);

    this.router.get("/listSchools", schoolController.listSchools);

    this.router.get("/test", schoolController.test);

  }

}


const schoolRouter = new SchoolRouter();

export default schoolRouter.router;

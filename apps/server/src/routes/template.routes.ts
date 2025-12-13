import express, { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { validateTemplateRequest } from "../middlewares/validateTemplateRequest.middleware";
import { TemplateController } from "../controllers/template.controller";

const router: Router = express.Router();

router.post(
  "/create",
  authenticateUser,
  validateTemplateRequest,
  TemplateController.createTemplateController
);

export default router;

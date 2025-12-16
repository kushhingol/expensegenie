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

router.delete(
  "/delete/:templateId",
  authenticateUser,
  TemplateController.deleteTemplateController
);

router.put(
  "/edit/:templateId",
  authenticateUser,
  validateTemplateRequest,
  TemplateController.updateTemplateController
);

router.get(
  "/:templateId",
  authenticateUser,
  TemplateController.getTemplateBytemplateIdController
);

router.get("/", authenticateUser, TemplateController.getTemplatesController);

export default router;

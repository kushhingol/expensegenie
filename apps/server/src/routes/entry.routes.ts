import express, { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { EntryController } from "../controllers/entry.controller";
import { validateCustomTemplateFields } from "../middlewares/validateCustomTemplateFields";
import { validatetemplateIdForWorkspaceId } from "../middlewares/validateTemplateIdForWorkspaceId.middleware";

const router: Router = express.Router();

router.post(
  "/create",
  authenticateUser,
  validatetemplateIdForWorkspaceId,
  validateCustomTemplateFields,
  EntryController.createEntryController
);

export default router;

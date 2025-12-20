import express, { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { WorkspaceController } from "../controllers/workspace.controller";
import { validateTemplateIdForWorkspace } from "../middlewares/validateTemplateIdForWorkspace.middleware";

const router: Router = express.Router();

router.post(
  "/create",
  authenticateUser,
  validateTemplateIdForWorkspace,
  WorkspaceController.createWorkspaceController
);

router.put(
  "/edit/:workspaceId",
  authenticateUser,
  validateTemplateIdForWorkspace,
  WorkspaceController.updateWorkspaceController
);

router.delete(
  "/delete/:workspaceId",
  authenticateUser,
  WorkspaceController.deleteWorkspaceController
);

export default router;

import express, { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { WorkspaceController } from "../controllers/workspace.controller";

const router: Router = express.Router();

router.post(
  "/create",
  authenticateUser,
  WorkspaceController.createWorkspaceController
);

router.delete(
  "/delete/:workspaceId",
  authenticateUser,
  WorkspaceController.deleteWorkspaceController
);

export default router;

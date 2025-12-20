import { Request, Response } from "express";
import { WorkspaceService } from "../services/workspace/workspace.service";
import { getUserIdFromRequest } from "../utils/user.utils";
import { ApiResponseUtil } from "../utils/response.utils";

export class WorkspaceController {
  static async createWorkspaceController(req: Request, res: Response) {
    return createWorkspaceControllerFn(req, res);
  }

  static async deleteWorkspaceController(req: Request, res: Response) {
    return softDeleteWorkspaceControllerFn(req, res);
  }

  static async updateWorkspaceController(req: Request, res: Response) {
    return updateWorkspaceControllerFn(req, res);
  }
}

const createWorkspaceControllerFn = async (req: Request, res: Response) => {
  try {
    const { name, templateId, tags, userId } = req.body;
    const userIdFromToken = getUserIdFromRequest(req);

    if (!name) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "Workspace name is required",
      });
    }

    const workspace = await WorkspaceService.createWorkspace({
      userId: userIdFromToken || userId,
      name,
      createdBy: userIdFromToken || userId,
      updatedBy: userIdFromToken || userId,
      templateId: templateId || "",
      tags: tags || [],
      isDeleted: false,
    });

    if (!workspace) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 500,
        errorMessage: "Failed to create workspace",
      });
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 201,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error: any) {
    console.log("Create Workspace Error:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: "Internal server error",
    });
  }
};

const softDeleteWorkspaceControllerFn = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const userIdFromToken = getUserIdFromRequest(req);
    if (!workspaceId) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "Workspace ID is required",
      });
    }
    const workspace = await WorkspaceService.softDeleteWorkspace(
      workspaceId,
      userIdFromToken || ""
    );

    if (!workspace) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 500,
        errorMessage: "Failed to delete workspace",
      });
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Workspace deleted successfully",
      data: workspace,
    });
  } catch (error: any) {
    console.log("Soft Delete Workspace Error:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: "Internal server error",
    });
  }
};

const updateWorkspaceControllerFn = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.params;
    const { name, templateId, tags, userId } = req.body;
    const userIdFromToken = getUserIdFromRequest(req);

    if (!workspaceId) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "Workspace ID is required",
      });
    }

    const workspace = await WorkspaceService.updateWorkspace(workspaceId, {
      userId: userIdFromToken || userId,
      name,
      templateId: templateId || "",
      tags: tags || [],
      updatedBy: userIdFromToken || userId,
    });

    if (!workspace) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 500,
        errorMessage: "Failed to update workspace",
      });
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (error: any) {
    console.log("Update Workspace Error:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: "Internal server error",
    });
  }
};

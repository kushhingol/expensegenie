import { Request, Response, NextFunction } from "express";
import { FieldType } from "@expensegenie/proto-gen";
import { ApiResponseUtil } from "../utils/response.utils";
import { WorkspaceModel } from "../models/workspace.model";

export const validatetemplateIdForWorkspaceId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { workspaceId, templateId } = req.body;
  if (!workspaceId) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 400,
      errorMessage: "No workspace Id found",
    });
  }

  if (!templateId) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 400,
      errorMessage: "No template Id found",
    });
  }

  const workspaceDetails = await WorkspaceModel.findById(workspaceId).lean();

  if (!workspaceDetails) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: "No workspace details found",
    });
  }

  const workspaceTemplateId = (workspaceDetails as any)?.templateId || "";

  if (!!workspaceTemplateId && workspaceTemplateId === templateId) {
    req.body.workspaceTags = (workspaceDetails as any)?.tags || [];
    next();
  } else {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 400,
      errorMessage:
        "template Id sent in request in not matching with the template id configured in the workspace",
    });
  }
};

import { NextFunction, Request, Response } from "express";
import { ApiResponseUtil } from "../utils/response.utils";
import { TemplateService } from "../services/template/template.service";

export const validateTemplateIdForWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { templateId } = req.body;
    if (typeof templateId !== "string") {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "templateId must be a string",
      });
    }

    // Validate only if templateId is non-empty after trimming
    if (!!templateId.trim()) {
      const template =
        await TemplateService.getTemplateByTemplateId(templateId);
      if (!template) {
        return ApiResponseUtil.sendErrorResponse({
          res,
          statusCode: 400,
          errorMessage: "Invalid templateId: Template does not exist",
        });
      }

      if (template.get("isDeleted")) {
        return ApiResponseUtil.sendErrorResponse({
          res,
          statusCode: 500,
          errorMessage: "Invalid templateId: Template is deleted",
        });
      }

      next();
    } else {
      // `templateId` is empty or only whitespace, proceed without validation
      next();
    }
  } catch (error) {
    console.error("Error in validateTemplateIdForWorkspace:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: `Internal Server Error: ${error}`,
    });
  }
};

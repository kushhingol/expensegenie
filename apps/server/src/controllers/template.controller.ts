import { Request, Response } from "express";
import { TemplateService } from "../services/template/template.service";
import { getUserIdFromRequest } from "../utils/user.utils";
import { ApiResponseUtil } from "../utils/response.utils";

export class TemplateController {
  static async createTemplateController(req: Request, res: Response) {
    return createTemplateControllerFn(req, res);
  }

  static async deleteTemplateController(req: Request, res: Response) {
    return deleteTemplateControllerMethod(req, res);
  }

  static async updateTemplateController(req: Request, res: Response) {
    return updateTemplateontrollerMethod(req, res);
  }

  static async getTemplateBytemplateIdController(req: Request, res: Response) {
    return getTemplateByTemplateIdControllerMethod(req, res);
  }

  static async getTemplatesController(req: Request, res: Response) {
    return getTemplatesControllerMethod(req, res);
  }
}

const createTemplateControllerFn = async (req: Request, res: Response) => {
  try {
    const { name, isPublic, customFields, userId } = req.body;

    const userIdFromToken = getUserIdFromRequest(req);

    if (!name || !customFields) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "name and customFields are required",
      });
    }

    const template = await TemplateService.createTemplate({
      userId: userIdFromToken || userId,
      name,
      isPublic,
      customFields,
      isDeleted: false,
    });

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 201,
      message: "Template created successfully",
      data: template,
    });
  } catch (error: any) {
    console.log("Create Template Error:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 400,
      errorMessage: error.message || "Failed to create template",
    });
  }
};

const deleteTemplateControllerMethod = async (req: Request, res: Response) => {
  try {
    const templateId = req?.params?.templateId;
    const deletedTemplate =
      await TemplateService.softDeleteTemplateFn(templateId);
    if (!deletedTemplate) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "Failed to delete template Id",
      });
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Template successfully deleted",
    });
  } catch (err: any) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: err?.message || "Failed to delete template",
    });
  }
};

const updateTemplateontrollerMethod = async (req: Request, res: Response) => {
  try {
    const templateId = req?.params?.templateId;
    const payload = req?.body;
    const { name, customFields, isPublic, userId } = payload;

    const userIdFromToken = getUserIdFromRequest(req);

    if (!name || !customFields) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 400,
        errorMessage: "name and customFields are required",
      });
    }

    const updateTemplate = await TemplateService.updateTemplate(templateId, {
      customFields,
      isPublic,
      name,
      userId: userIdFromToken || userId,
      isDeleted: false,
    });

    if (!updateTemplate) {
      throw new Error("Failted to update template");
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Template Updated successfully",
    });
  } catch (err: any) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: err?.message || "Failed to update template",
    });
  }
};

const getTemplateByTemplateIdControllerMethod = async (
  req: Request,
  res: Response
) => {
  try {
    const templateId = req?.params?.templateId;
    const templateDetails =
      await TemplateService.getTemplateByTemplateId(templateId);
    if (!templateDetails) {
      throw new Error("Template not found");
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Template fetched successfully",
      data: templateDetails,
    });
  } catch (err: any) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: err?.message || "Failed to get template",
    });
  }
};

const getTemplatesControllerMethod = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromRequest(req);
    const templates = await TemplateService.getTemplates(userId);
    if (!templates) {
      throw new Error("No templates found");
    }

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Templates fetched successfully",
      data: templates,
    });
  } catch (err: any) {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: err?.message || "Failed to get templates",
    });
  }
};

import { Request, Response } from "express";
import { TemplateService } from "../services/template/template.service";

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
}

const createTemplateControllerFn = async (req: Request, res: Response) => {
  try {
    const { name, isPublic, customFields, userId } = req.body;

    if (!name || !customFields) {
      return res.status(400).json({
        message: "name and customFields are required",
      });
    }

    const template = await TemplateService.createTemplate({
      userId,
      name,
      isPublic,
      customFields,
    });

    return res.status(201).json({
      message: "Template created successfully",
      data: template,
    });
  } catch (error: any) {
    console.log("Create Template Error:", error);
    return res.status(400).json({
      message: error.message || "Failed to create template",
    });
  }
};

const deleteTemplateControllerMethod = async (req: Request, res: Response) => {
  try {
    const templateId = req?.params?.templateId;
    const deletedTemplate = await TemplateService.deleteTemplateFn(templateId);
    if (!deletedTemplate) {
      return res.status(400).json({
        message: "Failed to delete template Id",
      });
    }
    return res.status(200).json({
      message: "Template successfully deleted",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err?.message || "Failed to delete template",
    });
  }
};

const updateTemplateontrollerMethod = async (req: Request, res: Response) => {
  try {
    const templateId = req?.params?.templateId;
    const payload = req?.body;
    const { name, customFields, isPublic } = payload;

    if (!name || !customFields) {
      return res.status(400).json({
        message: "name and customFields are required",
      });
    }

    const updateTemplate = await TemplateService.updateTemplate(templateId, {
      customFields,
      isPublic,
      name,
      userId: payload.userId,
    });

    if (!updateTemplate) {
      throw new Error("Failted to update template");
    }

    return res.status(200).json({
      message: "Tempate Updated successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Failed to update template",
    });
  }
};

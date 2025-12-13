import { Request, Response } from "express";
import { createTemplate } from "../services/template/template.service";

export class TemplateController {
  static async createTemplateController(req: Request, res: Response) {
    try {
      const { name, isPublic, customFields, userId } = req.body;

      console.log("Create Template Request Body:", req.body);

      if (!name || !customFields) {
        return res.status(400).json({
          message: "name and customFields are required",
        });
      }

      const template = await createTemplate({
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
  }
}

import { Response, NextFunction, Request } from "express";
import { TemplateModel } from "../models/template.model";
import { validateCustomFields } from "../validators/templateValidator";

export async function validateTemplateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { templateId, ...data } = req.body;
    let customFields = [];
    if (!data) {
      return res.status(400).json({
        message: "template Data is required",
      });
    }

    if (!!templateId) {
      const template = await TemplateModel.findById(templateId).lean();
      customFields = (template as any)?.customFields || [];
    } else {
      customFields = data?.customFields || [];
    }

    const result = validateCustomFields(customFields);

    if (!result.isValid) {
      return res.status(422).json({
        message: "Validation failed",
        errors: result.errors,
      });
    }

    // attach validated data if needed
    req.body.validatedData = data;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

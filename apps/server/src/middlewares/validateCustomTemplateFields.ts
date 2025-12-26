import { Request, Response, NextFunction } from "express";
import { FieldType } from "@expensegenie/proto-gen";
import { ApiResponseUtil } from "../utils/response.utils";
import { TemplateModel } from "../models/template.model";

export const validateCustomTemplateFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let templateFields = [];
  const { templateId } = req.body;

  if (typeof templateId !== "string") {
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 400,
      errorMessage: "templateId must be a string",
    });
  }

  if (!!templateId) {
    const template = await TemplateModel.findById(templateId).lean();
    if (!template) {
      return ApiResponseUtil.sendErrorResponse({
        res,
        statusCode: 500,
        errorMessage: "template not found",
      });
    }
    templateFields = (template as any)?.customFields || [];
  } else {
    templateFields = [];
  }

  const data = req.body.templateCustomFields || {};

  for (const field of templateFields) {
    const { label, type, required, options } = field;
    const value = data[label];

    // 1️⃣ Required check
    if (required && (value === undefined || value === null)) {
      return res.status(400).json({
        error: `Missing required field: ${label}`,
      });
    }

    // Skip validation if optional & not provided
    if (value === undefined || value === null) continue;

    // 2️⃣ Type validation
    if (!isValidType(value, type)) {
      return res.status(400).json({
        error: `Invalid type for field '${label}'. Expected ${type}`,
      });
    }

    // 3️⃣ Options validation (dropdown / enum)
    if (options?.length && !options.includes(value)) {
      return res.status(400).json({
        error: `Invalid value for field '${label}'. Allowed values: ${options.join(
          ", "
        )}`,
      });
    }
  }

  next();
};

function isValidType(value: any, type: FieldType): boolean {
  switch (type?.toString()) {
    case FieldType[FieldType.TEXT]:
      return typeof value === "string";

    case FieldType[FieldType.NUMBER]:
      return typeof value === "number" && !isNaN(value);

    case FieldType[FieldType.BOOLEAN]:
      return typeof value === "boolean";

    case FieldType[FieldType.DATE]:
      return !isNaN(Date.parse(value));

    case FieldType[FieldType.DROPDOWN]:
      return typeof value === "string";

    default:
      return false;
  }
}

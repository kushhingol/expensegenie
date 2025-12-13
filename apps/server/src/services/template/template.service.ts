import { TemplateModel } from "../../models/template.model";
import { Template as TemplateType } from "@expensegenie/proto-gen";

export class TemplateService {
  static async createTemplate(payload: Omit<TemplateType, "id">) {
    return createTemplateFn(payload);
  }

  static async deleteTemplateFn(templateId: string) {
    return deleteTemplateFn(templateId);
  }
}

export const createTemplateFn = async (payload: Omit<TemplateType, "id">) => {
  if (!payload.customFields || payload.customFields.length === 0) {
    throw new Error(
      "At least one custom field is required to create a template"
    );
  }

  const normalizedFields = payload.customFields.map((field) => ({
    label: field.label.trim(),
    type: field.type,
    options: field.options || [],
    required: field.required || false,
  }));

  const template = await TemplateModel.create({
    userId: payload.userId,
    name: payload.name.trim(),
    isPublic: payload.isPublic || false,
    customFields: normalizedFields,
  });

  return template;
};

const deleteTemplateFn = async (templateId: string) => {
  const deletedTemplate = await TemplateModel.findByIdAndDelete(templateId);
  if (!deletedTemplate) {
    throw new Error("Failed to delete template");
  }

  return deletedTemplate;
};

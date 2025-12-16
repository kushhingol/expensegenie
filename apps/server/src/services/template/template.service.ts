import { TemplateModel } from "../../models/template.model";
import { Template as TemplateType } from "@expensegenie/proto-gen";

export class TemplateService {
  static async createTemplate(payload: Omit<TemplateType, "id">) {
    return createTemplateFn(payload);
  }

  static async deleteTemplateFn(templateId: string) {
    return deleteTemplateFn(templateId);
  }

  static async updateTemplate(
    templateId: string,
    payload: Omit<TemplateType, "id">
  ) {
    return updateTemplateFn(templateId, payload);
  }

  static async getTemplateByTemplateId(templateId: string) {
    return getTemplateByTemplateIdFn(templateId);
  }

  static async getTemplates(userId: string) {
    return getTemplatesFn(userId);
  }
}

export const createTemplateFn = async (payload: Omit<TemplateType, "id">) => {
  if (!payload.customFields || payload.customFields.length === 0) {
    throw new Error(
      "At least one custom field is required to create a template"
    );
  }

  const normalizedFields = payload.customFields?.map((field) => ({
    label: field.label.trim(),
    type: field.type,
    options: field.options || [],
    required: field.required || false,
  }));

  const template = await TemplateModel.create({
    userId: payload.userId,
    name: payload.name.trim(),
    isPublic: payload.isPublic || false,
    customFields: normalizedFields || [],
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

const updateTemplateFn = async (
  templateId: string,
  payload: Omit<TemplateType, "id">
) => {
  if (!templateId) {
    throw new Error("templateId is missing");
  }

  if (!payload) {
    throw new Error("Payload is missing");
  }

  const normalizedFields = payload.customFields?.map((field) => ({
    label: field.label.trim(),
    type: field.type,
    options: field.options || [],
    required: field.required || false,
  }));

  const updateTemplate = await TemplateModel.findByIdAndUpdate(templateId, {
    userId: payload.userId,
    name: payload.name.trim(),
    isPublic: payload.isPublic,
    customFields: normalizedFields || [],
  });

  if (!updateTemplate) {
    throw new Error("Failed to update template");
  }

  return updateTemplate;
};

const getTemplateByTemplateIdFn = async (templateId: string) => {
  if (!templateId) {
    throw new Error("templateId is missing");
  }

  const templateDetails = await TemplateModel.findById(templateId);
  if (!templateDetails) {
    throw new Error("Template not found");
  }

  return templateDetails;
};

const getTemplatesFn = async (userId: string) => {
  if (!userId) {
    throw new Error("userId is missing");
  }

  const templates = await TemplateModel.find({
    $or: [{ userId: userId }],
  });

  if (!templates) {
    throw new Error("No templates found");
  }

  return templates;
};

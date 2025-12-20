import { TemplateModel } from "../../models/template.model";
import { Template as TemplateType } from "@expensegenie/proto-gen";

export class TemplateService {
  static async createTemplate(payload: Omit<TemplateType, "id">) {
    return createTemplateFn(payload);
  }

  static async softDeleteTemplate(templateId: string, userId: string) {
    return softDeleteTemplateFn(templateId, userId);
  }

  static async updateTemplate(
    templateId: string,
    payload: Omit<TemplateType, "id" | "createdBy">
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

const createTemplateFn = async (payload: Omit<TemplateType, "id">) => {
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
    isDeleted: payload.isDeleted || false,
    createdBy: payload.userId,
    updatedBy: payload.userId,
  });

  return template;
};

const softDeleteTemplateFn = async (templateId: string, userId: string) => {
  if (!templateId) {
    throw new Error("templateId is missing");
  }

  if (!userId) {
    throw new Error("userId is missing");
  }

  const softDeleteTemplate = await TemplateModel.findByIdAndUpdate(templateId, {
    isDeleted: true,
    updatedBy: userId,
  });

  if (!softDeleteTemplate) {
    throw new Error("Failed to delete template");
  }

  return softDeleteTemplate;
};

const updateTemplateFn = async (
  templateId: string,
  payload: Omit<TemplateType, "id" | "createdBy">
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
    isDeleted: payload.isDeleted || false,
    updatedBy: payload.userId,
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
    $and: [{ userId: userId }, { isDeleted: false }],
  });

  if (!templates || !templates.length) {
    throw new Error("No templates found");
  }

  return templates;
};

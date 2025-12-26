import { EntryModel } from "../../models/entry.model";
import { Entry as EntryType } from "@expensegenie/proto-gen";

export class EntryService {
  static async createEntry(payload: Omit<EntryType, "id">) {
    return createEntryFn(payload);
  }
}

const createEntryFn = async (payload: Omit<EntryType, "id">) => {
  if (!payload.userId || payload.userId.trim() === "") {
    throw new Error("User ID is required");
  }

  if (!payload.templateId || payload.templateId.trim() === "") {
    throw new Error("Template ID is required");
  }

  if (!payload.workspaceId || payload.workspaceId.trim() === "") {
    throw new Error("workspace ID is required");
  }

  const entry = await EntryModel.create({
    userId: payload.userId,
    templateId: payload.templateId,
    workspaceId: payload.workspaceId,
    tags: payload.tags || [],
    date: payload.date || "",
    isDeleted: false,
    textForEmbedding: payload.textForEmbedding,
    templateCustomFields: payload.templateCustomFields,
    createdBy: payload.userId,
    updatedBy: payload.userId,
  });

  return entry;
};

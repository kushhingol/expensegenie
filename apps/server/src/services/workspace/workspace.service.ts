import { WorkspaceModel } from "../../models/workspace.model";
import { Template, Workspace as WorkspaceType } from "@expensegenie/proto-gen";

export class WorkspaceService {
  static async createWorkspace(payload: Omit<WorkspaceType, "id">) {
    return createWorkspaceFn(payload);
  }
}

const createWorkspaceFn = async (payload: Omit<WorkspaceType, "id">) => {
  if (!payload.userId || payload.userId.trim() === "") {
    throw new Error("User ID is required");
  }

  if (!payload.name || payload.name.trim() === "") {
    throw new Error("Workspace name is required");
  }

  const workspace = await WorkspaceModel.create({
    userId: payload.userId,
    name: payload.name.trim(),
    templateId: payload.templateId || "",
    tags: payload.tags || [],
    createdBy: payload.userId,
    updatedBy: payload.userId,
  });

  return workspace;
};

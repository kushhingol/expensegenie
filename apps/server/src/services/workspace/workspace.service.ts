import { WorkspaceModel } from "../../models/workspace.model";
import { Template, Workspace as WorkspaceType } from "@expensegenie/proto-gen";

export class WorkspaceService {
  static async createWorkspace(payload: Omit<WorkspaceType, "id">) {
    return createWorkspaceFn(payload);
  }

  static async softDeleteWorkspace(workspaceId: string, userId: string) {
    return softDeleteWorkspaceFn(workspaceId, userId);
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

const softDeleteWorkspaceFn = async (workspaceId: string, userId: string) => {
  if (!workspaceId || workspaceId.trim() === "") {
    throw new Error("Workspace ID is required");
  }

  if (!userId || userId.trim() === "") {
    throw new Error("User ID is required");
  }

  const workspace = await WorkspaceModel.findByIdAndUpdate(
    workspaceId,
    {
      isDeleted: true,
      updatedBy: userId,
    },
    { new: true }
  );

  if (!workspace) {
    throw new Error("Failed to delete workspace");
  }
  return workspace;
};

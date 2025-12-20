import mongoose, { Schema, InferSchemaType } from "mongoose";
import { Workspace as WorkspaceSchema } from "@expensegenie/proto-gen";

export type WorkspaceDocument = InferSchemaType<typeof WorkspaceSchema>;

const workspaceSchema = new mongoose.Schema<WorkspaceDocument>(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    templateId: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export const WorkspaceModel = mongoose.model<WorkspaceDocument>(
  "Workspace",
  workspaceSchema
);

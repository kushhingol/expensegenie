import mongoose, { Schema, InferSchemaType } from "mongoose";
import { Entry as EntrySchema } from "@expensegenie/proto-gen";

export type EntrySchemaDocument = InferSchemaType<typeof EntrySchema>;

const entrySchema = new mongoose.Schema<EntrySchemaDocument>(
  {
    workspaceId: { type: String, required: true },
    userId: { type: String, required: true },
    templateId: { type: String, required: true },
    tags: { type: [String], default: [] },
    date: { type: String, required: true },
    textForEmbedding: { type: String },
    customTemplateFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export const EntryModule = mongoose.model<EntrySchemaDocument>(
  "Template",
  entrySchema
);

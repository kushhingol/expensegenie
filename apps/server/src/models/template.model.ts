import mongoose, { Schema, InferSchemaType } from "mongoose";

import {
  Template as TemplateSchema,
  CustomFields as CustomFieldsSchema,
  FieldType,
} from "@expensegenie/proto-gen";

export type CustomFieldDocument = InferSchemaType<typeof CustomFieldsSchema>;
export type TemplateDocument = InferSchemaType<typeof TemplateSchema>;

const customFieldsSchema = new mongoose.Schema<CustomFieldDocument>(
  {
    label: { type: String, required: true, trin: true },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: Object.values(FieldType),
    },
    options: { type: [String], default: [], required: false },
    required: { type: Boolean, default: false },
  },
  {
    _id: false, // important for clean arrays
  }
);

const templateSchema = new mongoose.Schema<TemplateDocument>(
  {
    name: { type: String, required: true },
    userId: { type: String, required: true },
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, required: true },
    customFields: {
      type: [customFieldsSchema],
      required: true,
      validate: {
        validator: (v: CustomFieldDocument[]) =>
          Array.isArray(v) && v.length > 0,
        message: "At leat one custom field is required",
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export const TemplateModel = mongoose.model<TemplateDocument>(
  "Template",
  templateSchema
);

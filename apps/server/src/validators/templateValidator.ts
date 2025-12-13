import { customFieldValidator } from "./customfieldValidator";
import {
  CustomFields as CustomFieldsSchema,
  FieldType,
} from "@expensegenie/proto-gen";

export function validateAgainstTemplate(
  templateFields: CustomFieldsSchema[],
  payload: Record<string, any>
) {
  const errors: Record<string, string> = {};

  for (const field of templateFields) {
    const value = payload[field.label];

    // Required check
    if (field.required && (value === undefined || value === null)) {
      errors[field.label] = "is required";
      continue;
    }

    // Type check
    const error = customFieldValidator(field.type, value, field.options);

    if (error) {
      errors[field.label] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const validateCustomFields = (customFields: CustomFieldsSchema[]) => {
  const errors: Record<string, string> = {};
  for (const field of customFields) {
    // Label validation
    if (!field.label || field.label.trim() === "") {
      errors[field.label] = "Label is required";
    }

    // Type validation
    if (field.type === undefined || field.type === null) {
      errors[field.label] = "Type is required";
    }

    if (
      !Object.values(FieldType).includes(field.type?.toString()?.toUpperCase())
    ) {
      errors[field.label] = "Invalid field type";
    }

    // Options validation for DROPDOWN and MULTI_SELECT
    if (
      field.type?.toString()?.toUpperCase() === FieldType.DROPDOWN.toString() ||
      field.type?.toString()?.toUpperCase() ===
        FieldType.MULTI_SELECT.toString()
    ) {
      if (!field.options || field.options.length === 0) {
        errors[field.label] =
          "Options are required for DROPDOWN and MULTI_SELECT types";
      }
    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

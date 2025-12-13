import { FieldType } from "@expensegenie/proto-gen";

export const customFieldValidator = (
  type: FieldType,
  value: any,
  options?: string[]
): string | null => {
  if (value === undefined || value === null) return null;

  switch (type) {
    case FieldType.TEXT:
    case FieldType.TEXTAREA:
      if (typeof value !== "string") return "must be a string value";
      return null;

    case FieldType.NUMBER:
    case FieldType.AMOUNT:
      if (typeof value !== "number" || isNaN(value))
        return "must be a valid number";
      return null;

    case FieldType.DROPDOWN:
      if (!options?.includes(value))
        return `must be one of [${options?.join(", ")}]`;
      return null;

    case FieldType.MULTI_SELECT:
      if (!Array.isArray(value)) return "must be an array";
      if (!value.every((v) => options?.includes(v)))
        return `must contain only [${options?.join(", ")}]`;
      return null;

    case FieldType.CHECKBOX:
      if (typeof value !== "boolean") return "must be boolean";
      return null;

    default:
      return "unsupported field type";
  }
};

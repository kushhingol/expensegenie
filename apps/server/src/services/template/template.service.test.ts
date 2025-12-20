import { TemplateModel } from "../../models/template.model";
import {
  CustomFields,
  FieldType,
  Template as TemplateType,
} from "@expensegenie/proto-gen";
import { TemplateService } from "./template.service";

jest.mock("../../models/template.model");

const mockTemplateModel = TemplateModel as jest.Mocked<typeof TemplateModel>;

describe("Template Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTemplateFn", () => {
    const validPayload: Omit<TemplateType, "id"> = {
      userId: "user123",
      name: "Sample Template",
      isPublic: true,
      customFields: [
        { label: "Field1", type: FieldType.TEXT, options: [], required: true },
      ],
      isDeleted: false,
      createdBy: "user123",
      updatedBy: "user123",
    };

    it("should create a template successfully with valid payload", async () => {
      const mockTemplate = { ...validPayload, id: "template123" };
      mockTemplateModel.create.mockResolvedValueOnce(mockTemplate as any);

      const result = await TemplateService.createTemplate(validPayload);

      expect(mockTemplateModel.create).toHaveBeenCalledWith({
        userId: validPayload.userId,
        name: validPayload.name.trim(),
        isPublic: validPayload.isPublic,
        customFields: validPayload.customFields.map((field) => ({
          label: field.label.trim(),
          type: FieldType.TEXT,
          options: field.options || [],
          required: field.required || false,
        })),
        isDeleted: validPayload.isDeleted,
        createdBy: validPayload.userId,
        updatedBy: validPayload.userId,
      });
      expect(result).toEqual(mockTemplate);
    });

    it("should throw an error if customFields is empty", async () => {
      const invalidPayload = { ...validPayload, customFields: [] };

      await expect(
        TemplateService.createTemplate(invalidPayload)
      ).rejects.toThrow(
        "At least one custom field is required to create a template"
      );
      expect(mockTemplateModel.create).not.toHaveBeenCalled();
    });

    it("should normalize customFields (trim labels, set defaults)", async () => {
      const payloadWithSpaces = {
        ...validPayload,
        customFields: [
          {
            label: "  Field1  ",
            type: FieldType.TEXT,
            options: ["opt1"],
            required: true,
          },
        ],
      };
      const mockTemplate = { ...payloadWithSpaces, id: "template123" };
      mockTemplateModel.create.mockResolvedValue(mockTemplate as any);

      await TemplateService.createTemplate(payloadWithSpaces);

      expect(mockTemplateModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user123",
          name: "Sample Template",
          isPublic: true,
          isDeleted: false,
          customFields: [
            {
              label: "Field1",
              type: FieldType.TEXT,
              options: ["opt1"],
              required: true,
            },
          ],
          createdBy: "user123",
          updatedBy: "user123",
        })
      );
    });
  });

  describe("softDeleteTemplateFn", () => {
    it("should soft delete a template successfully", async () => {
      const mockTemplate = {
        id: "template123",
        isDeleted: true,
        updatedBy: "user123",
      };
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(mockTemplate);

      const result = await TemplateService.softDeleteTemplate(
        "template123",
        "user123"
      );

      expect(mockTemplateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "template123",
        { isDeleted: true, updatedBy: "user123" }
      );
      expect(result).toEqual(mockTemplate);
    });

    it("should throw an error if template not found", async () => {
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        TemplateService.softDeleteTemplate("invalidId", "user123")
      ).rejects.toThrow("Failed to delete template");
      expect(mockTemplateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "invalidId",
        { isDeleted: true, updatedBy: "user123" }
      );
    });

    it("should return error if templateId is missing", async () => {
      const templateId = "";

      await expect(
        TemplateService.softDeleteTemplate(templateId, "user123")
      ).rejects.toThrow("templateId is missing");

      expect(mockTemplateModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should return error if userId is missing", async () => {
      const userId = "";
      const templateId = "template123";

      await expect(
        TemplateService.softDeleteTemplate(templateId, userId)
      ).rejects.toThrow("userId is missing");
      expect(mockTemplateModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("updateTemplateFn", () => {
    const validPayload: Omit<TemplateType, "id"> = {
      userId: "user123",
      name: "Updated Template",
      isPublic: true,
      customFields: [
        {
          label: "Field1",
          type: FieldType.NUMBER,
          options: [],
          required: false,
        },
      ],
      isDeleted: false,
      createdBy: "user123",
      updatedBy: "user123",
    };

    it("should update a template successfully", async () => {
      const mockTemplate = { ...validPayload, id: "template123" };
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(mockTemplate);

      const result = await TemplateService.updateTemplate(
        "template123",
        validPayload
      );

      expect(mockTemplateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "template123",
        {
          userId: "user123",
          name: "Updated Template",
          isPublic: true,
          customFields: [
            {
              label: "Field1",
              type: FieldType.NUMBER,
              options: [],
              required: false,
            },
          ],
          isDeleted: false,
          updatedBy: "user123",
        }
      );
      expect(result).toEqual(mockTemplate);
    });

    it("should throw an error if templateId is missing", async () => {
      await expect(
        TemplateService.updateTemplate("", validPayload)
      ).rejects.toThrow("templateId is missing");
      expect(mockTemplateModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should throw an error if payload is missing", async () => {
      await expect(
        TemplateService.updateTemplate("template123", null as any)
      ).rejects.toThrow("Payload is missing");
      expect(mockTemplateModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("should throw an error if update fails (template not found)", async () => {
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        TemplateService.updateTemplate("template123", validPayload)
      ).rejects.toThrow("Failed to update template");
    });

    it("should normalize customFields during update", async () => {
      const payloadWithSpaces = {
        ...validPayload,
        customFields: [
          {
            label: "  Field1  ",
            type: FieldType.TEXT,
            options: ["opt1"],
            required: true,
          },
        ],
      };
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue({
        id: "template123",
      });

      await TemplateService.updateTemplate("template123", payloadWithSpaces);

      expect(mockTemplateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "template123",
        expect.objectContaining({
          userId: "user123",
          name: "Updated Template",
          isPublic: true,
          isDeleted: false,
          customFields: [
            {
              label: "Field1",
              type: FieldType.TEXT,
              options: ["opt1"],
              required: true,
            },
          ],
        })
      );
    });
  });

  describe("getTemplateByTemplateIdFn", () => {
    it("should get a template by templateId", async () => {
      const mockTemplate = { id: "template123", name: "Test Template" };

      mockTemplateModel.findById.mockResolvedValue(mockTemplate as any);

      const result =
        await TemplateService.getTemplateByTemplateId("template123");

      expect(mockTemplateModel.findById).toHaveBeenCalledWith("template123");
      expect(result).toEqual(mockTemplate);
    });
  });

  it("should throw an error if templateId is missing", async () => {
    await expect(TemplateService.getTemplateByTemplateId("")).rejects.toThrow(
      "templateId is missing"
    );

    expect(mockTemplateModel.findById).not.toHaveBeenCalled();
  });

  it("should throw error if template is not found", async () => {
    const templateId = "template123";

    mockTemplateModel.findById.mockResolvedValue(null);

    await expect(
      TemplateService.getTemplateByTemplateId(templateId)
    ).rejects.toThrow("Template not found");

    expect(mockTemplateModel.findById).toHaveBeenCalledWith(templateId);
  });

  describe("getTemplates", () => {
    const validTemplate1 = {
      userId: "user123",
      name: "V1 Template",
      isPublic: true,
      customFields: [
        {
          label: "Field1",
          type: "number",
          options: [],
          required: false,
        },
      ],
      isDeleted: false,
    };

    const validTemplate2 = {
      userId: "user123",
      name: "V2 Template",
      isPublic: true,
      customFields: [
        {
          label: "Field1",
          type: "text",
          options: [],
          required: true,
        },
      ],
      isDeleted: false,
    };

    it("should return templates based on userId", async () => {
      const userId = "user123";

      const mocktemplates = [validTemplate1, validTemplate2] as any[];

      mockTemplateModel.find.mockResolvedValue(mocktemplates);

      const result = await TemplateService.getTemplates(userId);

      expect(mockTemplateModel.find).toHaveBeenCalledWith({
        $and: [{ userId: userId }, { isDeleted: false }],
      });
      expect(result).toEqual(mocktemplates);
    });

    it("should return error if userId is missing", async () => {
      const userId = "";

      await expect(TemplateService.getTemplates(userId)).rejects.toThrow(
        "userId is missing"
      );

      expect(mockTemplateModel.find).not.toHaveBeenCalled();
    });

    it("should return error if no templates are found", async () => {
      const userId = "user123";

      mockTemplateModel.find.mockResolvedValue([]);

      await expect(TemplateService.getTemplates(userId)).rejects.toThrow(
        "No templates found"
      );

      expect(mockTemplateModel.find).toHaveBeenCalledWith({
        $and: [{ userId: userId }, { isDeleted: false }],
      });
    });
  });
});

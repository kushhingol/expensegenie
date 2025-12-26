import { Request, Response } from "express";
import { EntryService } from "../services/entry/entry.service";
import { getUserIdFromRequest } from "../utils/user.utils";
import { ApiResponseUtil } from "../utils/response.utils";

export class EntryController {
  static async createEntryController(req: Request, res: Response) {
    return createEntryControllerFn(req, res);
  }
}

export const createEntryControllerFn = async (req: Request, res: Response) => {
  try {
    const {
      workspaceId,
      templateId,
      tags,
      templateCustomFields,
      date,
      textForEmbedding,
      userId,
    } = req.body;
    const userIdFromToken = getUserIdFromRequest(req);

    if (!userId || !templateId || !workspaceId) {
      const missingFieldsArray = [];
      if (!userId) missingFieldsArray.push("userId");
      if (!templateId) missingFieldsArray.push("templateId");
      if (!workspaceId) missingFieldsArray.push("workspaceId");
      return ApiResponseUtil.sendErrorResponse({
        statusCode: 400,
        errorMessage: `Missing fields ${missingFieldsArray.join(",")} `,
        res,
      });
    }

    const entry = await EntryService.createEntry({
      userId: userId || userIdFromToken,
      templateId: templateId,
      workspaceId: workspaceId,
      tags: tags.length ? tags : req?.body?.workspaceTags || [],
      isDeleted: false,
      createdBy: userId || userIdFromToken,
      updatedBy: userId || userIdFromToken,
      date: date || "",
      textForEmbedding: textForEmbedding || "",
      templateCustomFields: templateCustomFields || {},
    });

    if (!entry) {
      return ApiResponseUtil.sendErrorResponse({
        statusCode: 500,
        errorMessage: "Faield to create an entry",
        res,
      });
    }

    return ApiResponseUtil.sendResponse({
      statusCode: 200,
      message: "Enrty created successfully",
      res,
      data: entry,
    });
  } catch (error) {
    console.error(error);
    return ApiResponseUtil.sendErrorResponse({
      errorMessage: `Failed to add entry. Error: ${error}`,
      statusCode: 500,
      res,
    });
  }
};

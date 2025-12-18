import { Response } from "express";
import {
  ErrorResponseTypeParam,
  ResponseTypeParam,
} from "../types/response.types";

export class ApiResponseUtil {
  static sendResponse(responseParams: ResponseTypeParam) {
    return sendResponseFn(responseParams);
  }

  static sendErrorResponse(errorResponseParams: ErrorResponseTypeParam) {
    return sendErrorResponseFn(errorResponseParams);
  }
}

export const sendResponseFn = ({
  res,
  statusCode,
  message,
  data,
}: ResponseTypeParam) => {
  return res.status(statusCode).json({
    message,
    data: data || null,
  });
};

export const sendErrorResponseFn = ({
  res,
  statusCode,
  errorMessage,
}: ErrorResponseTypeParam) => {
  return res.status(statusCode).json({
    error: errorMessage,
  });
};

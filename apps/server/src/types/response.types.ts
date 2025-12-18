import { Response } from "express";

export type ResponseTypeParam = {
  res: Response;
  statusCode: number;
  message: string;
  data?: any;
};

export type ErrorResponseTypeParam = {
  res: Response;
  statusCode: number;
  errorMessage: string;
};

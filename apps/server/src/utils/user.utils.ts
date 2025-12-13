import { Request } from "express";

export const getUserIdFromRequest = (req: Request): string => {
  const { userId } = req.user as { userId: string };
  return userId || "";
};

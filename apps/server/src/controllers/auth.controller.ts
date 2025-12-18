import { Request, Response } from "express";
import {
  verifyGoogleToken,
  createOrGetUser,
  generateJWT,
} from "../services/auth/auth.service";
import { ApiResponseUtil } from "../utils/response.utils";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: "idToken required" });

    const payload = await verifyGoogleToken(idToken);
    if (!payload)
      return res.status(400).json({ message: "Invalid Google token" });

    const user = await createOrGetUser(payload);
    const jwtToken = generateJWT(user._id.toString());

    return ApiResponseUtil.sendResponse({
      res,
      statusCode: 200,
      message: "Login successful",
      data: { user, token: jwtToken },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return ApiResponseUtil.sendErrorResponse({
      res,
      statusCode: 500,
      errorMessage: "Internal server error",
    });
  }
};

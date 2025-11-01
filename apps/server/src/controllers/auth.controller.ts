import { Request, Response } from "express";
import {
  verifyGoogleToken,
  createOrGetUser,
  generateJWT,
} from "../services/auth.service";

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);
    if (!payload)
      return res.status(400).json({ message: "Invalid Google token" });

    const user = await createOrGetUser(payload);
    const jwtToken = generateJWT(user._id.toString());

    return res.json({ user, token: jwtToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

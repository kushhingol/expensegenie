import jwt from "jsonwebtoken";
import { googleClient, CLIENT_IDS } from "../../config/google";
import { User } from "../../models/user.model";
import dotenv from "dotenv";

dotenv.config();

export const verifyGoogleToken = async (token: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: CLIENT_IDS,
  });
  const payload = ticket.getPayload();
  return payload;
};

export const createOrGetUser = async (payload: any) => {
  let user = await User.findOne({ googleId: payload.sub });
  if (!user) {
    user = await User.create({
      googleId: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  }
  return user;
};

export const generateJWT = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

export const CLIENT_IDS = [
  process.env.GOOGLE_CLIENT_ID_WEB!,
  process.env.GOOGLE_CLIENT_ID_ANDROID!,
  process.env.GOOGLE_CLIENT_ID_IOS!,
];

export const googleClient = new OAuth2Client();

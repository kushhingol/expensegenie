import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "GOOGLE_CLIENT_ID_WEB",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID_ANDROID",
  "GOOGLE_CLIENT_ID_IOD",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI!,
  googleClientIdWeb: process.env.GOOGLE_CLIENT_ID_WEB!,
  googleClientIdAndroid: process.env.GOOGLE_CLIENT_ID_ANDROID!,
  googleClientIdIOS: process.env.GOOGLE_CLIENT_ID_IOS!,
  jwtSecret: process.env.JWT_SECRET!,
};

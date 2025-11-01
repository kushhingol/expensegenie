import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

const requiredEnvVars = [
  "PORT",
  "MONGO_URI",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "JWT_SECRET",
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI!,
  googleClientId: process.env.GOOGLE_CLIENT_ID!,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  jwtSecret: process.env.JWT_SECRET!,
};

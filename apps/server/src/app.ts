import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

// must be at the end
app.use(errorHandler);

export default app;

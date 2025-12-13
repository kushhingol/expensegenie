import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import templateRoutes from "./routes/template.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/templates", templateRoutes);

// must be at the end for managing errors
app.use(errorHandler);

export default app;

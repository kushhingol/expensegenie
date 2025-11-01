import express, { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware";
import { googleLogin } from "../controllers/auth.controller";

const router: Router = express.Router();

router.post("/google", googleLogin);
router.get("/profile", authenticateUser, (req, res) => {
  if (res.statusCode === 401) {
    res.json({ message: "Failed To Login", user: req.user });
  } else {
    res.json({ message: "Welcome to your profile", user: req.user });
  }
});

export default router;

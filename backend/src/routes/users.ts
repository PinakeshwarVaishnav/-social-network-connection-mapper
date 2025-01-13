import express, { Request, Response } from "express";
import { User } from "../models/user";

const router = express.Router();

router.get("", async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    console.log("error getting users from database", err);
    return res.status(500).json({ error: "Error fetching users" });
  }
});

export default router;

import express, { Request, Response } from "express";
import { User } from "../../models/user";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    console.log("new created user is", newUser);

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error,
    });
  }
});

export default router;

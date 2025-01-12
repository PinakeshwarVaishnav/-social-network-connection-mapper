import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../../models/user";

const loginRouter = express.Router();

loginRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(401).json({
      error: "invalid username",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: "invalid password",
    });
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  console.log("token for logged in user is", token);
  return res.json({ token });
});

export default loginRouter;

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import registerRouter from "./routes/auth/register";
import loginRouter from "./routes/auth/login";
import getUsersRouter from './routes/users'

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("mongodb uri is not defined in .env file");
}

app.use(express.json());

mongoose
  .connect(uri, {
    dbName: 'test'
  })
  .then(() => console.log("database connected"))
  .catch((error) =>
    console.log("connecting to database failed, error:", error),
  );

app.use("/user", registerRouter);
app.use("/user", loginRouter);
app.use('/users', getUsersRouter)

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

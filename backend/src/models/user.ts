import mongoose, { ObjectId, Schema } from "mongoose";
import { hash } from "bcrypt";

interface UserInterface {
  username: string;
  email: string;
  password: string;
  friends: ObjectId[];
  friendRequests: {
    sent: ObjectId[];
    received: ObjectId[];
  };
}

const UserSchema = new Schema<UserInterface>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: {
      sent: [{ type: Schema.Types.ObjectId, ref: "User" }],
      received: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log("error while hashing password", error);
    return next(error as Error);
  }
});

export const User = mongoose.model<UserInterface>("User", UserSchema);

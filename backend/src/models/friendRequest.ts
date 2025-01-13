import mongoose, { Date, ObjectId, Schema } from "mongoose";

export interface FriendRequestInterface {
  sender: ObjectId;
  recipient: ObjectId;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const FriendRequestSchema = new Schema<FriendRequestInterface>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export const FriendRequest = mongoose.model<FriendRequestInterface>(
  "FriendRequest",
  FriendRequestSchema,
);

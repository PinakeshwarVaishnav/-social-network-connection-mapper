import express, { Request, Response } from "express";
import { FriendRequest } from "../models/friendRequest";
import { User } from "../models/user";

const router = express.Router();

router.post("/send", async (req: Request, res: Response) => {
  try {
    const { senderId, recipientId } = req.body;

    if (!senderId || !recipientId) {
      return res.status(400).json({
        error: "Sender and recipient ids are required",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(400).json({
        error: "Friend request already sent",
      });
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      recipient: recipientId,
      status: "PENDING",
    });

    await newRequest.save();

    // Update sender user's sent requests
    await User.findByIdAndUpdate(senderId, {
      $addToSet: { "friendRequests.sent": recipientId },
    });

    // Update recipient user's received requests
    await User.findByIdAndUpdate(recipientId, {
      $addToSet: { "friendRequests.received": senderId },
    });

    return res.status(201).json({
      message: "Friend request sent successfully",
      request: newRequest,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to send friend request",
      details: err,
    });
  }
});

router.post("/accept", async (req: Request, res: Response) => {
  try {
    const { requestId } = req.body;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        error: "Friend request not found",
      });
    }

    if (!friendRequest || friendRequest.status !== "PENDING") {
      return res.status(400).json({ error: "Invalid friend request" });
    }

    // Update friend request status
    friendRequest.status = "ACCEPTED";
    await friendRequest.save();

    // Add to each user's friends list
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    // Remove from friend requests
    await User.findByIdAndUpdate(friendRequest.sender, {
      $pull: { "friendRequests.sent": friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $pull: { "friendRequests.received": friendRequest.sender },
    });

    return res.status(200).json({
      message: "Friend request accepted",
      request: friendRequest,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to accept friend request",
      details: err,
    });
  }
});

export default router;

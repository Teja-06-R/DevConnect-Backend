const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/admin");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const { Users } = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userid",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userid;
      const status = req.params.status;

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      if (fromUserId.toString() === toUserId) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const [toUser, existingRequest] = await Promise.all([
        Users.findById(toUserId).select("name"),
        ConnectionRequestModel.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        }),
      ]);

      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      if (existingRequest) {
        return res
          .status(400) // ✅ Changed from 409 to 400 for consistency
          .json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      // ✅ FIX: Handle duplicate key error gracefully
      try {
        const data = await connectionRequest.save();
        res.status(201).json({
          message:
            status === "interested"
              ? `Request sent to ${toUser.name}`
              : `Passed on ${toUser.name}`,
          data,
        });
      } catch (saveErr) {
        // Handle race condition: duplicate inserted between check and save
        if (saveErr.code === 11000) {
          return res
            .status(400)
            .json({ message: "Connection request already exists" });
        }
        throw saveErr;
      }
    } catch (err) {
      console.error("Connection request error:", err);
      res.status(500).json({ message: "Failed to process request" });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestid",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestid } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestid,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Request not found or already processed",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({ message: `Connection Request ${status}`, data });
    } catch (err) {
      res.status(400).json({ message: "ERROR:" + err.message });
    }
  }
);

module.exports = requestRouter;
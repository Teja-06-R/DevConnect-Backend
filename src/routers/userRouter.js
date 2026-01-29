const express = require("express");
const { userAuth } = require("../middlewares/admin");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const userRouter = express.Router();
const { Users } = require("../models/user");

// ✅ FIX: Prevent duplicate users in requests
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    })
      .populate("fromUserId", "name skills photoUrl age gender about")
      .lean(); // ✅ Use lean() for better performance

    // ✅ FIX: Filter out any null/undefined fromUserId (deleted users)
    const validRequests = connectionRequests.filter(req => req.fromUserId);

    res.json({
      message: "Connection requests fetched successfully",
      connectionRequests: validRequests,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// ✅ FIX: Never return logged-in user in connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "name skills photoUrl age gender about")
      .populate("toUserId", "name skills photoUrl age gender about")
      .lean();

    // ✅ FIX: Return the OTHER user, never the logged-in user
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send(data);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// ✅ FIX: Correct feed filtering logic
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    // ✅ FIX: Only hide users where I took action or connection is accepted
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        // Hide if I sent request (interested/ignored)
        { fromUserId: loggedInUser._id },
        // Hide if connection is accepted (by either party)
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).select("fromUserId toUserId");

    const hiddenUsers = new Set();
    connectionRequests.forEach((req) => {
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("name photoUrl skills age gender about")
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = userRouter;
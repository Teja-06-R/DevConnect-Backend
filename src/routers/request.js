const express = require("express");
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

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }

      const toUser =await Users.findById(toUserId );

      if (!toUser) {
        return res
          .status(400)
          .json({ message: " User not found to send Connection" });
      }
      const existingConnectionRequest=await ConnectionRequestModel.findOne({
        $or:[
          {fromUserId,toUserId},
          {fromUserId:toUserId,toUserId:fromUserId},
        ]
      })
      if(existingConnectionRequest){
        return res.status(400).json({message:"Connection Request Already Exists!!!"});
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({message:req.user.name+" is "+status+" in "+toUser.name, data,});
    } catch (err) {
      res.status(400).json({ message: "Invalid Request!" + err.message });
    }
  }
);

requestRouter.post("/request/review/:status/:requestid",userAuth,async(req,res)=>{
 try{ 
  const {status,requestid}=req.params;
  const loggedInUser=req.user;
   
  const allowedStatus=["accepted","rejected"];
  if(!allowedStatus.includes(status)){
    return res.status(400).send({message:"Invalid status"});
  }

  const connectionRequest=await ConnectionRequestModel.findOne({
    _id:requestid,
    toUserId:loggedInUser._id,
    status:"interested"
  });

  if(!connectionRequest){
    return res.status(400).json({message:"You are not authorized to review this request"});
  }
  connectionRequest.status=status;
  const data=await connectionRequest.save();

  res.json({message:"Connection Request:"+status,data});
  // requestId to be Valid
  //loggedIn UserId==toUserId
  //status == interested
  }
  catch(err){
    res.status(400).json({message:"ERROR:"+ err.message});
  }

})
module.exports = requestRouter;

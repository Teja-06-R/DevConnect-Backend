const express=require("express");
const { userAuth } = require("../middlewares/admin");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const userRouter=express.Router();
const {Users}=require("../models/user")

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
      const loggedInUser=req.user;
      const connectionRequests=await ConnectionRequestModel.find({
        toUserId:loggedInUser._id,
        status:"interested",
      }).populate("fromUserId","name skills");
      res.json({message:"Connected requests fetched successfully",connectionRequests});   
    }
    catch(err){
        res.status(400).send("Error:"+err.message);
    }
})


userRouter.get("/user/connections",userAuth,async(req,res)=>{
try{
   const loggedInUser=req.user;
   const connections=await ConnectionRequestModel.find({
    $or:[
      {fromUserId:loggedInUser._id,status:"accepted"},
      {toUserId:loggedInUser._id,status:"accepted"},
    ],
   }).populate("fromUserId","name skills")
     .populate("toUserId","name skills")

   const data=connections.map((row)=>{
    if(row.fromUserId._id.toString()===row.toUserId._id.toString()){
      return row.toUserId;
    }
    return row.fromUserId;
   })  
  res.send(data);
}
catch(err){
 res.status(400).send("Error:"+err.message);
}
})

userRouter.get("/user/feed",userAuth,async(req,res)=>{
  try{
     const loggedInUser=req.user;

     const page=parseInt(req.query.page)|| 1;
     let limit=parseInt(req.query.limit)|| 10;
     limit=limit>50?50:limit;
     const skip=(page-1)*limit;

     const connectionRequests=await ConnectionRequestModel.find({
      $or:[{fromUserId:loggedInUser._id},
        {toUserId:loggedInUser._id}
      ]
     }).select("fromUserId toUserId");

     const hiddenUsers=new Set();
     connectionRequests.forEach((req)=>{
      hiddenUsers.add(req.fromUserId.toString());
      hiddenUsers.add(req.toUserId.toString());
     })

     const users=await Users.find({
      $and:[{_id:{$nin:Array.from(hiddenUsers)}},
        {_id:{$ne:loggedInUser._id}}
      ]
     }).select("name photoUrl skills")
     .skip(skip)
     .limit(limit);
     
    res.json({data:users});
  }
  catch(err){
     res.status(400).send("Error:"+err.message);
  }
})
module.exports=userRouter;
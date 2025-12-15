const express=require("express");
const requestRouter=express.Router();
const {userAuth}=require("../middlewares/admin");


requestRouter.post("/sendconnection",userAuth,async(req,res)=>{
   
  try{
    const {name}=req.body;
    if(!name){
      throw new Error("Please Enter the Name of the connection");
    }
  res.send("Connection Request sent Succussfully to "+ name);
}
catch(err){
  res.send(err.message);
}
})

module.exports=requestRouter;
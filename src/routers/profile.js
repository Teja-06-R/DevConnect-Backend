const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/admin");


profileRouter.get("/profile",userAuth,async(req,res)=>{
  try{

    /*const cookies=req.cookies;
    const {token}=cookies;
    if(!token){
      throw new Error("Please Login First!");
    }

    const decodedMessage=jwt.verify(token,"Dev@Connect");  // it will give us a decoded message from jwt cookies.
    const {_id}=decodedMessage;
   
    console.log(_id);
    console.log(cookies);
    const user=await Users.findById({_id:_id});*/
    res.send(req.user);
  }
  catch(err){
      res.send(err.message);
  }
})

module.exports=profileRouter;
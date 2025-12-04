const jwt=require("jsonwebtoken");
const {Users}=require("../models/user");

const userAuth=async(req,res,next)=>{
    try{
      const {token}=req.cookies;
    if(!token){
      throw new Error("Please Login!!!");
    }
    const decodedData=jwt.verify(token,"Dev@Connect");
    const {_id}=decodedData;

     
    const user=await Users.findById({_id:_id});
    if(!user){
      throw new Error("Please Login Again");
    }
    req.user=user;
    next();
  }
  catch(err){
    res.send(err.message);
  }
}
module.exports={
    userAuth
}
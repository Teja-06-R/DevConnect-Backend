const express=require("express");
const profileRouter=express.Router();
const {userAuth}=require("../middlewares/admin");
const {validateEditFields,passwordValidation}=require("../utils/validations");
const bcrypt=require('bcrypt');


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
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
      res.status(401).send(err.message);
  }
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
 try{
   if(!validateEditFields(req)){
    throw new Error("Invalid Update Profile");
  }
  const loggedInUser=req.user;
  Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
  await loggedInUser.save();
  res.json({message:`${req.user.name}, your profile updated successfully`,
            data:loggedInUser
  });
}
catch(err){
  res.status(400).send(err.message);
}
})
profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
   try{
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new passwords are required");
    }

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      req.user.password
    );

    if (!isOldPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }
    if(!passwordValidation(newPassword)){
      throw new Error("Set Strong Password!");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password=hashedPassword;
    await req.user.save();
    res.send("Password Updated Successfully");
  }
   catch(err){
     res.status(400).send(err.message);
   }
})
module.exports=profileRouter;
const express=require('express');
const authRouter=express.Router();
const {signupValidation}=require("../utils/validations");
const bcrypt=require('bcrypt');
const {Users}=require("../models/user");
const validator=require("validator");



authRouter.post("/signup",async (req,res)=>{
  //Validate the Data
  try{
    const {name,emailId,password}=req.body;
    signupValidation(req);
  //Encrypt the Data
   const hashedPassword=await bcrypt.hash(password,10);
  // creating new instance of the User model
  const newUser=new Users({name,
    emailId,
    password:hashedPassword,
  });
   
      await newUser.save(); // helping to store the data in database
   res.send("Data Sent Successfully");
   }
   catch(err){
    res.status(400).send("ERROR!"+ err.message);
   }
   /*const newUser=new Users({
    name:"Tharun",
    emailId:"tharun01@gmail.com",
    password:"tharun@18"
   })
   */
});
authRouter.post("/login",async (req,res)=>{
  try{
    const {emailId,password}=req.body;
    if(!validator.isEmail(emailId)){
      throw new Error("EmailId is not Valid!");
    }
    const user=await Users.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid=await user.passwordValidation(password);
    if(isPasswordValid){
       // here we will create a jwt
      const token=await user.getJWT();
      //store it into a cookie
      res.cookie("token",
        token,
        {maxAge:7*24*60*60*1000});
      res.send("Login Successful!");
    }
    else{
      throw new Error("Invalid credentials!");
    }

  }
  catch(err){
     res.status(400).send(""+err.message);
  }
})

module.exports=authRouter

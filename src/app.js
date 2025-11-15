const express=require('express');
const { connectDB } = require('./config/database');
const app=express();
const {Users}=require("./models/user");

app.use(express.json());

app.post("/signup",async (req,res)=>{
  console.log(req.body);
  // creating new instance of the User model
  const newUser=new Users(req.body);
   try{
      await newUser.save();
   res.send("Data Sent Successfully");
   }
   catch(err){
    res.status(400).send("Data Not sent!"+ err.message);
   }
   /*const newUser=new Users({
    name:"Tharun",
    emailId:"tharun01@gmail.com",
    password:"tharun@18"
   })
   */
});

app.get("/user",async(req,res)=>{
  const userEmail=req.body.emailId;
  
  try{
    const userDetails=await Users.find({emailId:userEmail});
    if((userDetails).length!=0){
      res.send(userDetails);
    }
    else{
      res.status(400).send("User not found");
    }
  }
  catch(err){
    res.status(400).send("Something went wrong"+ err.message);
  }
})

//Feed api
app.get("/feed",async(req,res)=>{  
  try{
    const userDetails=await Users.find({});
      res.send(userDetails);
  }
  catch(err){
    res.status(400).send("Something went wrong"+ err.message);
  }
})

app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;
  try{
    await Users.findByIdAndDelete(userId);
    res.send("Data Deleted Successfully");
  }
  catch(err){
    res.status(400).send("Failed to Delete Data. Try Again!!!");
  }
})

app.patch("/user/:_id",async(req,res)=>{
  const userMail=req.body.emailId;
  const id=req.params?._id;
  const data=req.body;

  try{
    const Allowed_Updates=['photoUrl','about','gender','skills','password'];
    const isUpdateAllowed=Object.keys(data).every((k)=>Allowed_Updates.includes(k));
    if(!isUpdateAllowed){
      throw new Error("Update Not allowed");
    }
    if(data.skills.length > 10){
      throw new Error("Skills Cannot be more than 10");
    }
    const updatedData=await Users.findByIdAndUpdate({_id:id},data,{runValidators:true});
    res.send("Updated successfully"+updatedData);
  }
  catch(err){
    res.status(400).send("DB not Updated. "+ err.message);
  }
})
connectDB()
.then(()=>{
   console.log("DB Connection Established Successfully");
   app.listen(7777,()=>{
    console.log('server connected successfully');
});
})
.catch((err)=>{
    console.error("Database cannot be connectted");
})

/*
app.use('/admin',(req,res,next)=>{
  let token='xyz';
    console.log("Middleware executed");
  if(token=='xyz'){
    next();
  }
  else{
    res.status(401).send('U are Not Admin');
  }
})
  */
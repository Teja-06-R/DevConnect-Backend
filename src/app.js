const express=require('express');
const { connectDB } = require('./config/database');
const app=express();
const {Users}=require("./models/user");
const {signupValidation}=require("./utils/validations");
const bcrypt=require('bcrypt');
const validator=require("validator");
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middlewares/admin");

app.use(express.json()); // it is applied for all the routes .
app.use(cookieParser()); // it is used for reading cookies!

app.post("/signup",async (req,res)=>{
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

app.post("/login",async (req,res)=>{
  
  try{
    const {emailId,password}=req.body;
    if(!validator.isEmail(emailId)){
      throw new Error("EmailId is not Valid!");
    }
    const user=await Users.findOne({emailId:emailId});
    if(!user){
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(isPasswordValid){
       // here we will create a jwt
      const token=jwt.sign({_id:user._id},
        "Dev@Connect",
         {expiresIn:"7d"}); 
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

app.get("/profile",userAuth,async(req,res)=>{
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

app.post("/sendconnection",userAuth,async(req,res)=>{
  res.send("Connection Request sent Succussfully to "+ req.body.name);
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
# DevConnect Api's

## authRouter
- POST/Signup
- POST/login
- POST/logout

## profileRouter
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/password

## ConnectionrequestRouter
- POST/request/send/:status/:userid
- POST/request/review/:status/:requestid

## userRouter
- GET/user/request/recived
- GET/user/connections
- GET/user/feed


Status: ignore,interested,accepted,rejected






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
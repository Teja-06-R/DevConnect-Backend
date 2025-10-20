const express=require('express');
const app=express();

app.get('/user',(req,res,next)=>{
    try{
        throw new Error("sdffgdfw");
        res.send("User data");
    }
    catch{
        res.status(500).send("Contact support"); 
    }
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.send("Something went wrong");
    }
})


app.listen('7777',()=>{
    console.log("Server connected Successfully");
})
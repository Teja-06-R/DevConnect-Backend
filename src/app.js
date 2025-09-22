const express=require('express');
const app=express();

app.get('/',(req,res)=>{
    res.send("Namaste user");
})
app.get('/hello',(req,res)=>{
    res.send("Hello user");
})
app.get('/test/ok',(req,res)=>{
    res.json({ message: "Namaste Testing...", status: "Ok" });
})

app.listen(7777,()=>{
    console.log('server connected successfully');
});
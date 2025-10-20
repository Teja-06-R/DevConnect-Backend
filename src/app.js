const express=require('express');
const app=express();
const {adminAuth,userAuth}=require('./middlewares/admin');


app.use('/admin',(req,res,next)=>{
  next();
})
app.get('/admin/getData',adminAuth,
  (req, res) => {
    console.log("user data sent");
    res.send("All data sent!");
  });

app.put('/admin/deleteData',adminAuth,
  (req,res)=>{
    res.send("Now u can delete the Data");
  }
)
app.get('/user/getItems',userAuth,(req,res)=>{
  res.send("Items sent successfully");
})
app.use('/user',userAuth,(req,res)=>{
  res.send("Use method");
})

app.listen(7777,()=>{
    console.log('server connected successfully');
});

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
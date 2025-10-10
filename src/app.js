const express=require('express');
const app=express();


app.get('/user',
  (req, res, next) => {
    console.log("Step 1: Checking login...");
    next(); // pass to next handler
  },
  (req, res, next) => {
    console.log("Step 2: Fetching data...");
    next(); // again move to next
  },
  (req, res,next) => {
    console.log("Step 3: Sending response...");
    next();
    res.send("User data sent!");
  }
);


app.get('/hello',(req,res)=>{
    res.send("Hello user");
})
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})

app.get(/.*fly$/, (req, res) => {
  res.send('/.*fly$/')
})

app.use('/test/ok',(req,res)=>{
    res.json({ message: "Namaste Testing...", status: "Ok" });
})
app.post('/hello',(req,res)=>{
    res.send({'firstname':'Himateja',
        'Lastname':'Reddi',
    });
})
app.put('/hello',(req,res)=>{
    res.send({'firstname':'Himateja',
        'Lastname':'Reddi',
        'age':21
    });
})
app.patch('/hello',(req,res)=>{
    res.send({'firstname':'Himateja',
        'Lastname':'Reddi',
        'Interest':'solving real world Problems using MERN'
    });
})
app.delete('/hello',(req,res)=>{
    res.send("Successfully Deleted!");
})


app.listen(7777,()=>{
    console.log('server connected successfully');
});

require('dotenv').config()
const http=require('http');
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const initializeSocket = require('./utils/initializeSocket');
app.set("trust proxy", 1); // 🔥 REQUIRED


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://himateja.indevs.in" 
    ],
    credentials: true,
  })
);



require('./utils/cronjob');
app.use(express.json()); // it is applied for all the routes .
app.use(cookieParser()); // it is used for reading cookies!

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const requestRouter = require("./routers/request");
const userRouter = require("./routers/userRouter");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server=http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DB Connection Established Successfully");
    server.listen(process.env.PORT, () => {
      console.log("server connected successfully");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
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

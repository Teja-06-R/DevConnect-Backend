const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.set("trust proxy", 1); // 🔥 REQUIRED

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-connect-ten-nu.vercel.app" // 👈 YOUR VERCEL URL
    ],
    credentials: true,
  })
);


require('dotenv').config()
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

connectDB()
  .then(() => {
    console.log("DB Connection Established Successfully");
    app.listen(process.env.PORT, () => {
      console.log("server connected successfully");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connectted");
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

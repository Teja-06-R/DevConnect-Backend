const mongoose=require('mongoose');

connectDB=async()=>{
   await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
   console.log("Connected to DB:", mongoose.connection.name);
};


module.exports={
    connectDB,
}

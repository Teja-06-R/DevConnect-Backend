const mongoose=require('mongoose');

connectDB=async()=>{
   await mongoose.connect('mongodb+srv://reddihimateja:Namastenode25@namastecluster.ylyvuh0.mongodb.net/devtinder');
   console.log("Connected to DB:", mongoose.connection.name);
};


module.exports={
    connectDB,
}

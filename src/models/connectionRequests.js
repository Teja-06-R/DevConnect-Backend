const mongoose=require('mongoose');
const validator=require('validator');

const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:"{VALUE} is incorrect Status type!",
        }
    },
},
{timestamps:true},
)

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    //check if fromUserId is equal to toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("!!!");
    }
    next();
})

const ConnectionRequestModel =
  mongoose.models.ConnectionRequests ||
  mongoose.model("ConnectionRequests", connectionRequestSchema);

module.exports={
    ConnectionRequestModel,

};
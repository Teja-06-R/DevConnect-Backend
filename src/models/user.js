const mongoose=require('mongoose');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');



const UsersSchema=new mongoose.Schema({
    name:{
      type:String,
      required:true,
      minLength:4,
      maxLength:24,
    },
    emailId:{
      type:String,
      required:true,
      unique:true,
      trim:true,
      lowercase:true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Email id is invalid!");
        }
      }
    },
    password:{
      type:String,
      required:true,
      minLength:8,
    },
    photoUrl:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/128/456/456212.png",
        validate(value){
        if(!validator.isURL(value)){
          throw new Error("Photo Url is invalid!");
        }
      }
    },
    gender:{
        type:String,
        validate(value){
          if(!['male','female','others'].includes(value.toLowerCase())){
            throw new Error("Gender Data is invalid!");
          }
        }
    },
    skills:{
      type:[String],
      required:true,
    }
},
{timestamps:true}
);

UsersSchema.methods.getJWT=async function(){
  const user=this;
  const token=await jwt.sign({_id:user._id},"Dev@Connect",{expiresIn:"7d"});
  
  return token;
}
UsersSchema.methods.passwordValidation=async function(passwordfromUser){
  const user=this;
  const isVaild=await bcrypt.compare(passwordfromUser,user.password);
  return isVaild;
}

const Users = mongoose.models.User || mongoose.model("User", UsersSchema);



module.exports={Users,

};
const mongoose=require('mongoose');
const validator=require('validator');

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

const Users=mongoose.model("User",UsersSchema);

module.exports={Users,

};
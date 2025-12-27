const validator=require('validator');

signupValidation=(req)=>{
    const {name,emailId,password}=req.body;
    if(!name){
        throw new Error("Name is Invalid!");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("EmailId is Invalid!");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Set Strong Password!");
    }
}
validateEditFields=(req)=>{
   const Allowed_updates=["name","photoUrl","skills"];

   return Object.keys(req.body).every((key)=>Allowed_updates.includes(key));

}
passwordValidation=(password)=>{
    return (validator.isStrongPassword(password));
}
module.exports={
    signupValidation,
    validateEditFields,
    passwordValidation
}
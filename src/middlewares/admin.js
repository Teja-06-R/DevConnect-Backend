const adminAuth=(req,res,next)=>{
  const token='xyz';
  const AdminAuthorized=(token==='xyz');
    console.log("Middleware executed");
  if(AdminAuthorized){
    next();
  }
  else{
    res.status(401).send('U are Not Admin');
  }
}
const userAuth=(req,res,next)=>{
    const token='teja';
    const Authorized=(token==='teja');
    if(Authorized){
        next();
    }
    else{
        res.status(401).send("Error "+res.statusCode);
    }
}
module.exports={
    adminAuth,
    userAuth
}
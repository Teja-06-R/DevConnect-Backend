# Episode-6(Database,Schemas&Models - Mongoose)

## Why Mongoose?

- MongoDB is schema-less → flexible but messy.
- Mongoose adds a schema layer on top → gives structure, validations, and control.
- Makes MongoDB feel like working with SQL models but still flexible.

## Install Mongoose

- npm install mongoose

🗂️ 3. Setup Database Connection

- Create: src/config/database.js (To connect Mongoose we need to create a config folder inside Src folder and create a file database.js)

## Code

- we need to import mongoose to our file (using require)
- Using connectDB=mongoose.connect("connection string") it returns a promise

const mongoose = require("mongoose");

const connectDB = async () => {
await mongoose.connect("YOUR_MONGO_CONNECTION_STRING");
console.log("DB Connected Successfully");
};

module.exports = { connectDB }; //- we need to export connectDB to our app.js because its very to start a server without connecting DB.

## 4. Why connectDB is important

We must connect to MongoDB before starting the server.

If DB is not connected → server should NOT start.

🚀 5. Use connectDB in app.js
const { connectDB } = require("./config/database");

connectDB().then(() => {
app.listen(procees.env.PORT, () => console.log("Server started"));
});

- Using that connectDB checking whether its connected or not if connected print DB connected successfully.

## 6. Mongoose Schema & Model Basics

Schema = Structure of a document
Model = Actual collection that interacts with MongoDB

Example:
onst UsersSchema=new mongoose.Schema({
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

const User = mongoose.model("User", userSchema);


## Creating Documents (Static Data Example)

When you hardcode values:

const newUser = new Users({
  name: "Tharun",
  emailId: "tharun01@gmail.com",
  password: "Tharun@123"
});


This only creates a document in memory, not in the database.

To save it:

await newUser.save();


Now the data is actually stored in MongoDB.

## 2. Creating Documents with Dynamic Data

From API input:

const { name, emailId, password } = req.body;

const newUser = new Users({
  name,
  emailId,
  password
});


Again — this does NOT save anything yet.

You MUST call:

await newUser.save();

## 3. Why .save() Is Needed

Because:

new Users({...}) = create object in memory

await newUser.save() = write it to MongoDB

Mongoose never inserts into DB until .save() runs.


## post api

authRouter.post("/signup",async (req,res)=>{

const { name, emailId, password } = req.body;

const newUser = new Users({
  name,
  emailId,
  password
});
await newUser.save();
 res.send("Data Added successfully");
}

## Both fields are automatically filled by mongodb
- _id is used to uniquely identify the document
- __v is to keep track of version of the document (how many times its updated).
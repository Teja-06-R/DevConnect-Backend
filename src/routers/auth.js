const express = require("express");
const authRouter = express.Router();
const { signupValidation } = require("../utils/validations");
const bcrypt = require("bcrypt");
const { Users } = require("../models/user");
const validator = require("validator");
const jwt = require("jsonwebtoken");


authRouter.post("/signup", async (req, res) => {
  try {
    const { name, emailId, password } = req.body;
    
    // Validation
    if (!name || !emailId || !password) {
      return res.status(400).send("All fields are required");
    }
    
    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    // Check if user exists
    const existingUser = await Users.findOne({ emailId });
    if (existingUser) {
      return res.status(400).send("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = new Users({
      name,
      emailId,
      password: hashedPassword,
    });
    
    await newUser.save();
    
    // Create JWT token (same as login)
    const token = jwt.sign({ _id: newUser._id }, "Dev@Connect", {
      expiresIn: "7d"
    });
    
    // Set cookie (same as login)
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 3600000),
      httpOnly: true
    });
    
    // ✅ IMPORTANT: Return user object directly (not wrapped in data)
    // Remove password from response
    const userObject = newUser.toObject();
    delete userObject.password;
    
    res.json(userObject);  // Same format as login!
    
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("EmailId is not Valid!");
    }
    const user = await Users.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }
    const isPasswordValid = await user.passwordValidation(password);
    if (isPasswordValid) {
      // here we will create a jwt
      const token = await user.getJWT();
      //store it into a cookie
      res.cookie("token", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.send(user);
    } else {
      throw new Error("Invalid credentials!");
    }
  } catch (err) {
    res.status(400).send("" + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("your profile is logged out Successfully!");
});

module.exports = authRouter;

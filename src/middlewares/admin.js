const jwt = require("jsonwebtoken");
const { Users } = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please Login" });
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    const { _id } = decodedData;

    const user = await Users.findById({ _id: _id });
    if (!user) {
      throw new Error("Authentication required");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send(err.message);
  }
};
module.exports = {
  userAuth,
};

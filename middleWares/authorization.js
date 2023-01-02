const jwt = require("jsonwebtoken");
const adminModel = require("../db/models/admin.model");

const auth = (typeA, typeB, typeC) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decryptedToken = jwt.verify(token, "TokenDecPass");
      const admin = await adminModel.findOne({
        _id: decryptedToken._id,
        "tokens.token": token,
      });
      if (!admin) throw new Error("user not found!...");
      if (
        admin.role === typeA ||
        admin.role === typeB ||
        admin.role === typeC
      ) {
        req.admin = admin;
        req.token = token;
        next();
      } else {
        throw new Error("Unauthorized!...");
      }
    } catch (e) {
      res.status(500).send({
        apiStatus: false,
        message: e.message,
      });
    }
  };
};

module.exports = auth;

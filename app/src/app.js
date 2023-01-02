const express = require("express");
require("../../db/dbConnection");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const userRouter = require("../../routes/user.route");
const adminRouter = require("../../routes/admin.route");
app.use("", userRouter);
app.use("", adminRouter);

app.get("*", (req, res) => {
  res.status(404).send({
    apiStatus: false,
    message: "Invalid Link!...",
  });
});

module.exports = app;

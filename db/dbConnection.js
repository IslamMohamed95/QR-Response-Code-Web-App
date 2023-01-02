require("dotenv").config();
const mongoose = require("mongoose");

DB_Name = process.env.Db_Name;
DB_URL = process.env.db_URL;
mongoose.connect(
  `mongodb+srv://islam:1234@qrcode.bjehz99.mongodb.net/QRcode?retryWrites=true&w=majority`,
  () => {
    console.log("Database is Connected :)!");
  }
);

//"mongodb+srv://islam:1234@qrcode.bjehz99.mongodb.net/QRcode?retryWrites=true&w=majority"

require("dotenv").config();
const app = require("./app/src/app");
PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Connected to the server!");
});

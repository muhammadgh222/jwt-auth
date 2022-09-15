const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE;

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Databse connected successfully");
  });

app.listen(PORT, () => {
  console.log(`App is running on port: ${PORT}`);
});

const express = require("express");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.json()); // to read json body

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.render("base");
});

module.exports = app;

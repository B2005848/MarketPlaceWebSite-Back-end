const express = require("express");
const path = require("path");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const producRouter = require("./routes/products.route");
const {
  resourceNotFound,
  methodNotAllowed,
  handleError,
} = require("./controller/errors.controller");
// create app use express
const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my project ",
  });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRouter);
app.use("/api/products", producRouter);
app.use(resourceNotFound);
app.use(methodNotAllowed);
app.use(handleError);

module.exports = app;

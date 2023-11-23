const express = require("express");
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

// CRUD Create Read Update Delete Sorting Filter Search ...
/** item/list
  item/add
  item/edit/12
  item/delete
*/
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to my project ",
  });
});

app.use("/api/users", userRouter);
app.use("/api/products", producRouter);
app.use(resourceNotFound);
app.use(methodNotAllowed);
app.use(handleError);

module.exports = app;

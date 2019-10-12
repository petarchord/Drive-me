const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;
const methodOverride = require("method-override");
const moment = require("moment");
const auth = require("./utility");
("use strict");
const sessionstorage = require("sessionstorage");
var url = "mongodb://localhost:27017/project3";
var dates = [];

const port = 3000;
const app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use((req, res, next) => {
  // res.locals.success_msg = req.flash("success_msg");
  // res.locals.error_msg = req.flash("error_msg");
  // res.locals.error = req.flash("error");
  res.locals.uri = req.path;
  next();
});

let router = require("./src/router");
router.forEach(route => {
  console.log("route:", route);
  app.use(route.path, route.handler);
});

app.listen(port, () => {
  console.log(`Listening on port ${port} ...`);
});

module.exports = [
  {
    path: "/",
    handler: require("./routes/index")
  },
  {
    path: "/myprofile",
    handler: require("./routes/profile")
  },
  {
    path: "/register",
    handler: require("./routes/register")
  },
  {
    path: "/mydrives",
    handler: require("./routes/drives")
  },
  {
    path: "/searchresult",
    handler: require("./routes/searchresult")
  }
];

const mongo = require("mongodb").MongoClient;
const auth = require("../../utility");

module.exports = {
  drives: {
    get(req, res, next) {
      var resultArray = [];
      var resultArrayDrives = [];
      if (!auth.getAuthStatus()) {
        res.render("login", {
          clicked: "mydrives"
        });
      } else {
        mongo.connect(
          "mongodb://localhost:27017",
          { useNewUrlParser: true },
          (err, client) => {
            if (err) {
              throw err;
            }
            var db = client.db("project3");
            db.collection("user").find(
              { auth: auth.getAuthToken() },
              (err, result) => {
                if (err) {
                  throw err;
                }
                console.log("My profile result :" + result[0]);
                result.forEach(
                  (doc, err) => {
                    if (err) {
                      throw err;
                    }
                    resultArray.push(doc);
                  },
                  () => {
                    if (resultArray.length == 0) {
                      res.render("login");
                    } else {
                      sessionstorage.setItem(
                        "username",
                        resultArray[0].username
                      );
                      var username = resultArray[0].username;
                      db.collection("drives").find(
                        { user: username },
                        (err, result) => {
                          if (err) {
                            throw err;
                          }
                          result.forEach(
                            (doc, err) => {
                              if (err) {
                                throw err;
                              }
                              resultArrayDrives.push(doc);
                            },
                            () => {
                              if (resultArrayDrives.length == 0) {
                                res.render("mydrives", {
                                  empty: true
                                });
                              } else {
                                res.render("mydrives", {
                                  empty: false,
                                  result: resultArrayDrives
                                });
                              }
                            }
                          );
                        }
                      );
                    }
                    client.close();
                  }
                );
              }
            );
          }
        );
      }
    },

    post(req, res, next) {
      var resultArray = [];
      mongo.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            throw err;
          }
          var db = client.db("project3");
          var username = sessionstorage.getItem("username");
          console.log("username in mydrives:" + username);
          db.collection("drives").insert(
            {
              start: req.body.start,
              end: req.body.end,
              date: req.body.date,
              time: req.body.time,
              car: req.body.car,
              price: req.body.price,
              phone: req.body.phone,
              persons: req.body.persons,
              descr: req.body.descr,
              user: username
            },
            (err, result) => {
              if (err) {
                throw err;
              }
            }
          );
          client.close();
          res.redirect("/mydrives");
        }
      );
    }
  },
  adddrive: {
    get(req, res, next) {
      if (!auth.getAuthStatus()) {
        res.render("login", {
          clicked: "adddrive"
        });
      } else {
        res.render("adddrive", {
          dates: dates
        });
      }
    }
  },
  editdrive: {
    get(req, res, next) {
      var resultArray = [];
      var id = req.params.id;
      mongo.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            throw err;
          }
          var db = client.db("project3");
          db.collection("drives").find({ _id: objectId(id) }, (err, result) => {
            if (err) {
              throw err;
            }
            result.forEach(
              (doc, err) => {
                if (err) {
                  throw err;
                }
                resultArray.push(doc);
              },
              () => {
                client.close();
                res.render("editdrive", {
                  result: resultArray[0],
                  dates: dates
                });
              }
            );
          });
        }
      );
    }
  },
  deletedrive: {
    get(req, res, next) {
      var id = req.params.id;
      mongo.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            throw err;
          }
          var db = client.db("project3");
          db.collection("drives").deleteOne(
            { _id: objectId(id) },
            (err, result) => {
              if (err) {
                throw err;
              }
              client.close();
              res.redirect("/mydrives");
            }
          );
        }
      );
    }
  }
};

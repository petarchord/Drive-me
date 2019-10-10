const mongo = require("mongodb").MongoClient;
const auth = require("../../utility");

module.exports = {
  profile: {
    get(req, res, next) {
      var resultArray = [];
      if (!auth.getAuthStatus()) {
        res.render("login", {
          clicked: "myprofile"
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
                      res.render("myprofile", {
                        name: resultArray[0].name,
                        lname: resultArray[0].lname,
                        email: resultArray[0].email,
                        username: resultArray[0].username
                      });
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

      if (req.body.register == "some") {
        //request comes from register form

        if (!req.body.uname || !req.body.passw || !req.body.passw2) {
          res.render("register", {
            error: "You have to enter all fields in order to create an account!"
          });
          return;
        }

        if (req.body.passw != req.body.passw2) {
          res.render("register", {
            error: "You have to enter the same password in both fields!"
          });
          return;
        }

        uname = req.body.uname;
        var passw = req.body.passw;
        var name = req.body.name;
        var lname = req.body.lname;
        var email = req.body.email;
        mongo.connect(
          "mongodb://localhost:27017",
          { useNewUrlParser: true },
          (err, client) => {
            if (err) {
              throw err;
            }
            var db = client.db("project3");
            db.collection("user").find(
              { username: req.body.uname },
              (err, result) => {
                if (err) {
                  throw err;
                }
                console.log("result login register:" + result);
                result.forEach(
                  (doc, err) => {
                    if (err) {
                      throw err;
                    }
                    resultArray.push(doc);
                  },
                  () => {
                    if (resultArray.length > 0) {
                      res.render("register", {
                        error:
                          "This username is already in use,try another one!"
                      });
                      client.close();
                      return;
                    } else {
                      var token = new Buffer(
                        req.body.uname + ":" + req.body.passw
                      ).toString("base64");
                      auth.setAuthToken(token);
                      auth.setAuthStatus(true);
                      db.collection("user").insert(
                        {
                          username: req.body.uname,
                          password: req.body.passw,
                          name: req.body.name,
                          lname: req.body.lname,
                          email: req.body.email,
                          auth: auth.getAuthToken()
                        },
                        (err, result) => {
                          if (err) {
                            throw err;
                          }
                        }
                      );
                      client.close();
                      res.render("myprofile", {
                        username: req.body.uname,
                        name: req.body.name,
                        lname: req.body.lname,
                        email: req.body.email
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
      //request comes from login form
      else {
        var resultArrayLogin = [];
        if (!req.body.username || !req.body.password) {
          res.render("login", {
            error: "You have to enter both , the username and password!"
          });
          return;
        }
        uname = req.body.username;
        var password = req.body.password;
        mongo.connect(
          "mongodb://localhost:27017",
          { useNewUrlParser: true },
          (err, client) => {
            if (err) {
              throw err;
            }
            var db = client.db("project3");
            db.collection("user").find(
              { username: req.body.username },
              (err, result) => {
                if (err) {
                  throw err;
                }
                result.forEach(
                  (doc, err) => {
                    if (err) {
                      throw err;
                    }
                    resultArrayLogin.push(doc);
                  },
                  () => {
                    if (resultArrayLogin.length == 0) {
                      client.close();
                      res.render("login", {
                        error: "Wrong username or password!"
                      });
                      return;
                    } else {
                      if (resultArrayLogin[0].password != req.body.password) {
                        client.close();
                        res.render("login", {
                          error: "Wrong username or password!"
                        });
                        return;
                      } else {
                        auth.setAuthToken(resultArrayLogin[0].auth);
                        auth.setAuthStatus(true);
                        client.close();
                        if (req.body.clicked == "myprofile") {
                          res.render("myprofile", {
                            username: resultArrayLogin[0].username,
                            name: resultArrayLogin[0].name,
                            lname: resultArrayLogin[0].lname,
                            email: resultArrayLogin[0].email
                          });
                        } else if (req.body.clicked == "mydrives") {
                          res.redirect("/mydrives");
                        } else {
                          res.redirect("/adddrive");
                        }
                      }
                    }
                  }
                );
              }
            );
          }
        );
      }
    }
  }
};

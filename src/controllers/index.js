const moment = require("moment");
const auth = require("../../utility");
const mongo = require("mongodb").MongoClient;

module.exports = {
  index: {
    get(req, res, next) {
      var m;
      var dates = [];
      for (var i = 0; i < 20; i++) {
        // m=moment().add(i,'days').format('dddd MMM Do YY');
        m = moment()
          .add(i, "days")
          .format("L");
        dates.push(m);
      }
      res.render("searchdrive", {
        dates: dates,
        snap: false
      });
    }
  },
  about: {
    get(req, res) {
      res.render("about");
    }
  },
  register: {
    get(req, res, next) {
      res.render("register");
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
          dates: auth.getDates()
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
  },
  logout: {
    get(req, res, next) {
      if (auth.getAuthStatus()) {
        auth.setAuthStatus(false);
        auth.setAuthToken("");
      }
      res.redirect("/");
    }
  }
};

const mongo = require("mongodb").MongoClient;
const utility = require("../../utility");

module.exports = {
  search: {
    get(req, res, next) {
      var id = req.params.id;
      var resultArray = [];
      mongo.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            res.send({ msg: err });
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
                res.render("driveinfo", {
                  start: resultArray[0].start,
                  end: resultArray[0].end,
                  date: resultArray[0].date,
                  time: resultArray[0].time,
                  car: resultArray[0].car,
                  price: resultArray[0].price,
                  phone: resultArray[0].phone,
                  descr: resultArray[0].descr,
                  persons: resultArray[0].persons
                });
                client.close();
              }
            );
          });
        }
      );
    },

    post(req, res, next) {
      //db interaction code
      var resultArray = [];
      mongo.connect(
        "mongodb://localhost:27017",
        { useNewUrlParser: true },
        (err, client) => {
          if (err) {
            res.send({ msg: err });
          }
          var db = client.db("project3");
          db.collection("drives").find(
            {
              $and: [
                { start: req.body.start },
                { end: req.body.end },
                { date: req.body.date }
              ]
            },
            (err, result) => {
              if (err) {
                console.log("error occured!");
                res.send({ msg: err });
              }
              result.forEach(
                (doc, err) => {
                  if (err) {
                    res.send({ msg: err });
                  }
                  resultArray.push(doc);
                },
                () => {
                  console.log("resultArray:" + resultArray.length);
                  if (resultArray.length == 0) {
                    res.render("searchdrive", {
                      snap: true,
                      dates: utility.getDates()
                    });
                  } else {
                    res.render("searchresult", {
                      result: resultArray,
                      date: resultArray[0].date
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
  }
};

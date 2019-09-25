const moment = require("moment");

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
  }
};

const moment = require("moment");
const auth = {};

auth.status = false;
auth.token = "";
auth.dates = [];
auth.getAuthStatus = function() {
  return auth.status;
};

auth.setAuthStatus = function(status) {
  auth.status = status;
};

auth.getAuthToken = function() {
  return auth.token;
};

auth.setAuthToken = function(token) {
  auth.token = token;
};
auth.getDates = function() {
  var m;
  for (var i = 0; i < 20; i++) {
    // m=moment().add(i,'days').format('dddd MMM Do YY');
    m = moment()
      .add(i, "days")
      .format("L");
    auth.dates.push(m);
  }
  return auth.dates;
};

module.exports = auth;

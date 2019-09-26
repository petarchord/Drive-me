const auth = {};

auth.status = false;
auth.token = "";
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

module.exports = auth;

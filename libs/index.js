var request = require('request');

const BASE = "https://graph.facebook.com/v2.5";

var FB = function(options) {
  function init() {
    if(!options['app_id'] || !options['app_secret']) {
      throw "app_id or app_secret was not set";
    }
  }

  init();
}

FB.prototype.api(path, access_token, fields, cb) {
  var options = {
    url : BASE + path + "?fields=" + fields.join(","),
    headers : {
      "Authorization" : "OAuth " + access_token
    },
    method : "GET"
  }

  return request(options, cb);
}

module.exports = FB;

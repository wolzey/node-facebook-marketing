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

FB.prototype.api = function(path, access_token, fields, cb) {
  var insightFields = "";

  if(fields !== null) {
    insightFields = fields.join(",");
  }

  var options = {
    url : BASE + path + insightFields,
    headers : {
      "Authorization" : "OAuth " + access_token
    },
    method : "GET"
  }

  return request(options, cb);
}

module.exports = FB;

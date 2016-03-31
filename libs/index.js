var request = require('request');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');

const BASE = "https://graph.facebook.com/v2.5";

var FB = function(options) {
  EventEmitter.call(this);
  if(!options['access_token']) {
    console.error("access_token must be set");
  }

  this.access_token = options['access_token'];
}

util.inherits(FB, EventEmitter);

FB.prototype.api = function(path, access_token, fields, cb) {
  var self = this;

  var insightFields = "";

  if(fields !== null) {
    insightFields = fields.join(",");
  }

  var options = {
    url : BASE + path + insightFields,
    headers : {
      "Authorization" : "OAuth " + self.access_token
    },
    method : "GET"
  }
  if(cb) {
    return request(options, cb);
  }
  request(options, function(err, response, body) {
    if(err) {
      return self.emit('fb:error', err);
    }

    return self.emit("fb:response", response);
  });
}

module.exports = FB;

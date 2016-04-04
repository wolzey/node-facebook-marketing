var request = require('request');
var EventEmitter = require('events').EventEmitter;
var util         = require('util');
var _            = require('lodash');

const BASE = "https://graph.facebook.com/v2.5";
var OAuth;
var fbSelf;
var FB = function() {
  this.access_token;
  this.client_id;
  this.app_id;
  fbSelf = this;
}

util.inherits(FB, EventEmitter);

//Return Ad Accounts from User_id
FB.prototype.getAdAccounts = function(cb) {
  return makeFbRequest('/' + this.userId + '/adaccounts', null, cb);
}

FB.prototype.getToken = function() {
  return this.access_token;
}

FB.setUser = function(user_id) {
  this.userId = user_id;
}

FB.prototype.setToken = function(token) {
  this.access_token = token;
  return this;
}

// Allow user to get USERID
FB.prototype.getMe = function(fields, cb) {
  return makeFbRequest('/me', fields, cb);
}

FB.prototype.getCampaigns = function(act_id, cb) {
  return makeFbRequest('/act_' +act_id+ "/campaigns", null, cb);
}

FB.prototype.getAdsets = function(camp_id, cb) {
  return makeFbRequest("/" +act_id+ "/adsets", null, cb);
}

FB.prototype.getAds = function(adset_id, cb) {
  return makeFbRequest("/" +adset_id+ "/ads", null, cb);
}

FB.prototype.getAccountInsights = function(act_id, fields, cb) {
  return makeFbRequest("/act_" +act_id+ "/insights", fields, cb);
}

FB.prototype.getInsights = function(id, fields, cb) {
  return makeFBRequest("/" +id+ "/insights", fields, cb);
}

//Simplify Request process to Facebook API
function makeFbRequest(path, fields, cb) {
  var insightFields = "";
  if(fields !== null) {
    insightFields = fields.join(",");
  }

  var options = {
    url : BASE + path + insightFields,
    headers : {
      "Authorization" : "OAuth " + fbSelf.access_token
    },
    method : "GET"
  }

  if(cb) {
    return request(options, cb);
  }

  request(options, function(err, response, body) {
    if(err) {
      return fbSelf.emit("fb:error", err);
    }

    return fbSelf.emit("fb:response", response);
  });
}

FB.prototype.setLongAccessToken = function(cb) {
  if(_.has(fbSelf, 'access_token')) {
    var requestURL = BASE + '/oauth/access_token?grant_type=fb_exchange_token&'+
        'client_id='+fbSelf.app_id+'&client_secret='+fbSelf.client_secret+
        '&fb_exchange_token='+fbSelf.access_token + '&redirect_uri=' +fbSelf.redirect_uri;

        request(requestURL, function(err, response, body) {
          if(err) {
            return false;
          }

          var jsonResponse = JSON.parse(response.body);

          if(jsonResponse) {
            fbSelf.access_token = jsonResponse.access_token;
            return cb(true, jsonResponse);
          } else {
            console.log("NO ACCESS TOKEN");
          }
        });
  } else {
    console.log("NO ACCESS TOKEN");
  }
}

module.exports = new FB();

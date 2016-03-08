/**
 * @author qianqing
 * @create by 16-3-8
 * @description
 */
var api_config = require('./api_config.json');

var ApiFactory = {
  CreateApi: function (model) {
    var api;
    switch (model) {
      case "login":
        api = new LoginApi();
        break;
      default:
        throw new Error("ApiFactory Unsupported: " + model);
        break;
    }
    return api;
  }
};

exports = module.exports = ApiFactory;

var LoginApi = function(){};

LoginApi.prototype = {
  login : function(){
    return api_config.loginService.baseUrl + api_config.loginService.method.login;
  }
};

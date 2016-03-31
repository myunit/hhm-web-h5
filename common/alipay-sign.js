/**
 * @author qianqing
 * @create by 16-3-31
 * @description
 */
var baseConfig = require('./config');
var crypto = require('crypto');
var https = require('https');

/**
 * 向支付宝发送请求
 *
 * @param host
 * @param port
 * @param path
 * @param callback
 */
var requestUrl = function(host, port, path, callback) {
  var req = https.request({
    host: host,
    port: port,
    path: path,
    method: 'GET'
  }, function(res) {
    res.on('data', function(d) {
      callback(d);
    });
  });
  req.end();
  req.on('error', function(e) {
    console.error(e);
  });
};

// 验证签名
exports.veritySign = function(params, callback) {
  var sign = params['sign'] ? params['sign'] : '';
  if (this.buildSign(params) == sign) {
    if (params['notify_id']) {
      // 获取远程服务器ATN结果，验证是否是支付宝服务器发来的请求
      requestUrl(
        baseConfig.ALIPAY_HOST,
        baseConfig.ALIPAY_PORT,
        baseConfig.HTTPS_VERIFY_PATH + "partner=" + baseConfig.partner + "&notify_id=" + params['notify_id'],
        function(responseTxt) {
          if (responseTxt) {
            callback(true);
          }else{
            callback(false);
          }
        });
    }
  } else {
    callback(false);
  }
};

// 创建签名
exports.buildSign = function (params) {
  if (!params) {
    return null;
  }

  // 排除传入参数中sign和sign_type，并且内容为空的参数
  var newParams = [];
  for (var key in params) {
    if (!params.hasOwnProperty(key)
      || !params[key]
      || key == 'sign'
      || key == 'sign_type') {
      continue;
    }

    newParams.push([key, params[key]]);
  }
  newParams.sort();

  // 拼接URL地址
  var url_params = this.buildURL(newParams, false);
  url_params += baseConfig.key; //把拼接后的字符串再与安全校验码直接连接起来

  return crypto.createHash('md5').update(url_params, baseConfig.input_charset).digest('hex');
};


// 拼接URL地址
exports.buildURL = function (params, needUrlEncode) {
  var url_params = "";
  var i = 0;
  for (var paramsKey in params)
  {
    if (!params.hasOwnProperty(paramsKey)) {
      continue;
    }

    var paramsValue = "";
    if (needUrlEncode == false) {
      paramsValue = params[paramsKey];
    } else {
      paramsValue = encodeURIComponent(params[paramsKey]);
    }

    if (i < (params.length - 1)) {
      url_params += paramsKey + "=" + paramsValue;
    } else {
      url_params += paramsKey + "=" + paramsValue + "&";
    }
    i++;
  }

  return url_params.toString();
};

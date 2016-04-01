/**
 * @author qianqing
 * @create by 16-3-31
 * @description
 */
var express = require('express');
var unirest = require('unirest');
var router = express.Router();
var libSign = require('../common/alipay-sign');

var ApiFactory = require('../common/api_config');
var orderApi = ApiFactory.CreateApi('order');

router.post('/pay-notify-app', function (req, res, next) {
  var trade_status = req.body.trade_status;//交易状态
  var data = req.body;
  libSign.verity(req.body, function(result) {
    if (result) {
      if (trade_status=="TRADE_SUCCESS") {
        var out_trade_no = data['out_trade_no'];
        out_trade_no = out_trade_no.split('_');
        var userId = parseInt(out_trade_no[0]);
        var orderId = parseInt(out_trade_no[1]);

        var userName = data['buyer_email'];
        var total = data['total_fee']*100/100;

        var obj = {
          "userId": userId,
          "orderId": orderId,
          "note": "支付宝支付",
          "buyer": userName,
          "total": total,
          "tradeId": data['trade_no'],
          "type": 1
        };

        console.log('data: ' + data);
        console.log('trade_no: ' + data['trade_no']);
        console.log('obj: ' + JSON.stringify(obj));
        unirest.post(orderApi.createPaymentRecord())
          .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
          .send(obj)
          .end(function (response) {
          });
      }

      res.end("success");
    } else{
      res.end("fail");
    }

  });
});

module.exports = router;

/**
 * @author qianqing
 * @create by 16-2-20
 * @description book route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var shoppingApi = ApiFactory.CreateApi('shopping');
var orderApi = ApiFactory.CreateApi('order');

router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

/* GET users listing. */
router.route('/confirm')
  .get(function (req, res, next) {
    res.render('booking-confirm', {title: '订单确认-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(shoppingApi.submitOrder())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
      .send({
        "userId": req.session.uid,
        "receiverId": parseInt(req.body.receiverId),
        "logistics": req.body.logistics,
        "payment": parseInt(req.body.payment),
        "cartIds": JSON.parse(req.body.cartIds),
        "device": ""
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }

        if (data.status) {
          res.json({status: data.status, orderId: data.orderId});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.get('/complete', function (req, res, next) {
  res.render('booking-complete', {title: '提交完成-好好卖'});
});

router.get('/pay-way', function (req, res, next) {
  res.render('booking-pay-way', {title: '在线支付-好好卖'});
});

router.route('/detail')
  .get(function (req, res, next) {
    res.render('booking-detail', {title: '订单详情-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(orderApi.getOrderDetail())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token': req.session.token})
      .send({
        "userId": req.session.uid,
        "orderId": parseInt(req.body.orderId)
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }

        if (data.status) {
          res.json({status: data.status, order: data.order});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });


module.exports = router;

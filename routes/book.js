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

router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

/* GET users listing. */
router.get('/confirm', function(req, res, next) {
  res.render('booking-confirm', { title: '订单确认-好好卖' });
});

router.get('/complete', function(req, res, next) {
  res.render('booking-complete', { title: '提交完成-好好卖' });
});

router.get('/pay-way', function(req, res, next) {
  res.render('booking-pay-way', { title: '在线支付-好好卖' });
});

router.get('/detail', function(req, res, next) {
  res.render('booking-detail', { title: '订单详情-好好卖' });
});


module.exports = router;

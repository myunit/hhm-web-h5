/**
 * @author qianqing
 * @create by 16-2-20
 * @description book route
 */
var express = require('express');
var router = express.Router();

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
  res.render('book-detail', { title: '提交完成-好好卖' });
});


module.exports = router;

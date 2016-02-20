/**
 * @author qianqing
 * @create by 16-2-20
 * @description book route
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('booking-confirm', { title: '订单确认-好好卖' });
});

router.get('/complete', function(req, res, next) {
  res.render('booking-complete', { title: '提交完成-好好卖' });
});


module.exports = router;

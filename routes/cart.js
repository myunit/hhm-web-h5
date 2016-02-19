/**
 * @author qianqing
 * @create by 16-2-19
 * @description cart route
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/cart', function(req, res, next) {
  res.render('cart', { title: '购物车-好好卖' });
});

router.get('/cart-no-footer', function(req, res, next) {
  res.render('cart-no-footer', { title: '购物车-好好卖' });
});

module.exports = router;

/**
 * @author qianqing
 * @create by 16-2-16
 * @description product route
 */
var express = require('express');
var router = express.Router();

router.get('/sales', function(req, res, next) {
  res.render('product-list', { title: '特卖-好好卖' });
});

router.get('/new', function(req, res, next) {
  res.render('product-list', { title: '新品-好好卖' });
});

module.exports = router;

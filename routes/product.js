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

router.get('/group', function(req, res, next) {
  res.render('product-list', { title: '组合商品-好好卖' });
});

router.get('/recommend', function(req, res, next) {
  res.render('product-list', { title: '组合商品-好好卖' });
});

router.get('/list', function(req, res, next) {
  res.render('product-list', { title: '商品列表-好好卖' });
});

router.get('/secKill', function(req, res, next) {
  res.render('product-flash-deal-list', { title: '秒杀-好好卖' });
});

router.get('/secKill-detail', function(req, res, next) {
  res.render('product-detail', { title: '商品详情-好好卖' });
});

router.get('/class', function(req, res, next) {
  res.render('product-class', { title: '商品分类-好好卖' });
});

module.exports = router;

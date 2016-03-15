/**
 * @author qianqing
 * @create by 16-2-16
 * @description product route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var router = express.Router();

var productApi = ApiFactory.CreateApi('product');

router.use(function (req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

router.get('/sales', function (req, res, next) {
  res.render('product-list', {title: '特卖-好好卖'});
});

router.get('/new', function (req, res, next) {
  res.render('product-list', {title: '新品-好好卖'});
});

router.get('/group', function (req, res, next) {
  res.render('product-list', {title: '组合商品-好好卖'});
});

router.get('/recommend', function (req, res, next) {
  var title = '推荐栏目0' + req.query.id + '-好好卖';
  res.render('product-list', {title: title});
});

router.route('/category')
  .get(function (req, res, next) {
    res.render('product-list', {title: '商品列表-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getCategoryProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "CId": req.body.CId,
        "ChildCId": req.body.ChildCId,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.get('/secKill', function (req, res, next) {
  res.render('product-flash-deal-list', {title: '秒杀-好好卖'});
});

router.get('/secKill-detail', function (req, res, next) {
  res.render('product-detail', {title: '商品详情-好好卖'});
});

router.get('/detail', function (req, res, next) {
  res.render('product-detail', {title: '商品详情-好好卖'});
});

router.get('/group-detail', function (req, res, next) {
  res.render('product-group-detail', {title: '商品详情-好好卖'});
});

router.route('/class')
  .get(function (req, res, next) {
    res.render('product-class', {title: '商品分类-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getCategory())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"categoryId": 0})
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
        }
        if (data.status) {
          res.json({status: data.status, category: data.category.ChildList});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

module.exports = router;

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
  if (req.session && req.session.uid) {
    next();
  } else {
    res.redirect('/');
  }
});

router.route('/sales')
  .get(function (req, res, next) {
    res.render('product-list', {title: '特卖-好好卖'});
  }).post(function (req, res, next) {
    unirest.post(productApi.getSalesProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/new')
  .get(function (req, res, next) {
    res.render('product-list', {title: '新品-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getNewProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/group')
  .get(function (req, res, next) {
    res.render('product-group-list', {title: '组合商品-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getGroupProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/recommend')
  .get(function (req, res, next) {
    var title = req.query.name + '-好好卖';
    res.render('product-recommend-list', {title: title});
  }).post(function (req, res, next) {
    unirest.post(productApi.getRecommendProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "recommendId": req.body.CId,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
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
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/secKill')
  .get(function (req, res, next) {
    res.render('product-flash-deal-list', {title: '秒杀-好好卖'});
  }).post(function (req, res, next) {
    unirest.post(productApi.getSecKillProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/secKill-detail')
  .get(function (req, res, next) {
    res.render('product-flash-deal-detail', {title: '商品详情-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getSecKillProductDetail())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "productId": req.body.productId
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, product: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/detail')
  .get(function (req, res, next) {
    res.render('product-detail', {title: '商品详情-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getProductDetail())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "productId": req.body.productId
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, product: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/group-detail')
  .get(function (req, res, next) {
    res.render('product-group-detail', {title: '商品详情-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(productApi.getGroupProductDetail())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "productId": req.body.productId
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, product: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
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
          return;
        }
        if (data.status) {
          res.json({status: data.status, category: data.category.ChildList});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.route('/search')
  .get(function (req, res, next) {
    res.render('search', {title: '商品列表-好好卖'});
  }).post(function (req, res, next) {
    unirest.post(productApi.searchProduct())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({
        "userId": req.session.uid,
        "key": req.body.key,
        "pageId": req.body.pageId,
        "pageSize": req.body.pageSize
      })
      .end(function (response) {
        var data = response.body.repData;
        if (data === undefined) {
          res.json({status: 0, msg: '服务异常'});
          return;
        }
        if (data.status) {
          res.json({status: data.status, count: data.count, products: data.product});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.post('/get-carousel', function (req, res, next) {
  unirest.post(productApi.getCarousel())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({
      "userId": req.session.uid,
      "carouselId": parseInt(req.body.carouselId)
    })
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      console.log(11111);
      if (data.status) {
        res.json({status: data.status, carousel: data.carousel});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;

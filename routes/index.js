var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var CityChoose = require('../common/city_choose');
var router = express.Router();

var loginApi = ApiFactory.CreateApi('login');
var customerApi = ApiFactory.CreateApi('customer');

/* GET home page. */
router.route('/')
  .get(function (req, res, next) {
    req.session = null;
    res.render('login', {title: '登录-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.login())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.username, "password": req.body.password})
      .end(function (response) {
        var data = response.body.repData;
        if (data.status) {
          req.session.uid = data.customer.SysNo;
          req.session.token = data.token;
          res.json({status: data.status, redirect: '/index'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });


router.get('/choose-shop-style', function (req, res, next) {
  res.render('choose-shop-style', {title: '完善店铺类型-好好卖'});
});

router.get('/index', function (req, res, next) {
  console.log('req.session.uid:' + req.session.uid);
  if (req.session.uid) {
    res.render('index', {title: '首页-好好卖'});
  } else {
    res.redirect('/');
  }
});

router.route('/register')
  .get(function (req, res, next) {
    res.render('register', {title: '注册-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.registerAndLogin())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.phone, "password": req.body.password, "code": req.body.captcha})
      .end(function (response) {
        var data = response.body.repData;
        if (data.status) {
          req.session.uid = data.customer.SysNo;
          req.session.token = data.token;
          res.json({status: data.status, redirect: '/register-complete'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

router.post('/get-captcha', function (req, res, next) {
  unirest.post(loginApi.getCaptcha())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({"phone": req.body.phone, "type": req.body.type})
    .end(function (response) {
      var data = response.body.repData;
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.route('/register-complete')
  .get(function (req, res, next) {
    if (req.session.uid) {
      res.render('register-complete', {title: '信息完善-好好卖'});
    } else {
      res.redirect('/');
    }
  })
  .post(function (req, res, next) {
    var pcdDes = req.body.pcdDes.split(' ');
    CityChoose.getPCD(pcdDes[0], pcdDes[1], pcdDes[2], function (err, pcd) {
      if (err) {
        console.error('get pcd error: ' + err);
        res.json({status: 0, msg: err});
        return;
      }

      unirest.post(customerApi.perfectCustomerInfo())
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send({
          "userId": req.session.uid, "storeName": req.body.storeName,
          "receiver": {
            "name": req.body.receiver,
            "phone": req.body.phone,
            "provinceId": pcd.province.id,
            "province": pcd.province.name,
            "cityId": pcd.city.id,
            "city": pcd.city.name,
            "districtId": pcd.district.id,
            "district": pcd.district.name,
            "address": req.body.address
          }
        })
        .end(function (response) {
          var data = response.body.repData;
          if (data.status) {
            res.json({status: data.status, redirect: '/index'});
          } else {
            res.json({status: data.status, msg: data.msg});
          }
        });
    });
  });

router.route('/rest-password')
  .get(function (req, res, next) {
    res.render('rest-password', {title: '重置密码-好好卖'});
  })
  .post(function (req, res, next) {
    unirest.post(loginApi.forgetPassword())
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .send({"phone": req.body.phone, "newPassword": req.body.password, "code": req.body.captcha})
      .end(function (response) {
        var data = response.body.repData;
        if (data.status) {
          req.session = null;
          res.json({status: data.status, redirect: '/'});
        } else {
          res.json({status: data.status, msg: data.msg});
        }
      });
  });

module.exports = router;

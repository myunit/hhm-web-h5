/**
 * @author qianqing
 * @create by 16-2-20
 * @description address route
 */
var express = require('express');
var unirest = require('unirest');
var ApiFactory = require('../common/api_config');
var CityChoose = require('../common/city_choose');
var router = express.Router();
var customerApi = ApiFactory.CreateApi('customer');

router.use(function (req, res, next) {
  if (req.path.indexOf('get-street') === -1) {
    if (req.session && req.session.uid) {
      next();
    } else {
      res.redirect('/');
    }
  } else {
    next();
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('address-select', { title: '选择地址-好好卖' });
});

router.get('/manage', function(req, res, next) {
  res.render('address-select', { title: '地址管理-好好卖' });
});

router.get('/add', function(req, res, next) {
  res.render('address-edit', { title: '新增地址-好好卖' });
});

router.get('/modify', function(req, res, next) {
  res.render('address-edit', { title: '修改地址-好好卖' });
});

router.post('/set-default-receiver', function (req, res, next) {
  unirest.post(customerApi.setDefaultReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/get-all-receiver',function (req, res, next) {
  var obj = {"userId": req.session.uid};
  if (req.body.receiverId) {
    obj.receiverId = parseInt(req.body.receiverId);
  }

  unirest.post(customerApi.getReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send(obj)
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }

      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, receiver: data.receiver});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/del-receiver', function (req, res, next) {
  unirest.post(customerApi.delReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send({"userId": req.session.uid, "receiverId": req.body.receiverId})
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/modify-receiver', function (req, res, next) {
  var pcdCode = req.body['pcdCode[]'];
  var pcdName = req.body['pcdName[]'];
  var obj = {
    "userId": req.session.uid,
    "receiverId": req.body.receiverId,
    "name": req.body.receiver,
    "phone": req.body.phone,
    "provinceId": pcdCode[0],
    "province": pcdName[0],
    "cityId": pcdCode[1],
    "city": pcdName[1],
    "districtId": pcdCode[2],
    "district": pcdName[2],
    "address": req.body.address,
    "street": req.body.street,
    "streetId": parseInt(req.body.streetId),
    "isDefault": req.body.isDefault
  };
  unirest.post(customerApi.modifyReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send(obj)
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, receiverId: data.receiverId});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/add-receiver', function (req, res, next) {
  var pcdCode = req.body['pcdCode[]'];
  var pcdName = req.body['pcdName[]'];
  var obj = {
    "userId": req.session.uid,
    "receiverId": req.body.receiverId,
    "name": req.body.receiver,
    "phone": req.body.phone,
    "provinceId": pcdCode[0],
    "province": pcdName[0],
    "cityId": pcdCode[1],
    "city": pcdName[1],
    "districtId": pcdCode[2],
    "district": pcdName[2],
    "address": req.body.address,
    "street": req.body.street,
    "streetId": parseInt(req.body.streetId),
    "isDefault": req.body.isDefault
  };

  unirest.post(customerApi.addReceiver())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'X-Access-Token':req.session.token})
    .send(obj)
    .end(function (response) {
      var error = response.body.error;
      if (error && error.message === 'Authorization Required') {
        res.json({status: -1, msg: '您的登录已过期，请重新登录！'});
        return;
      }
      
      var data = response.body.repData;
      console.log('data: ' + JSON.stringify(data));
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }
      if (data.status) {
        res.json({status: data.status, receiverId: data.receiverId});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

router.post('/get-street',function (req, res, next) {
  unirest.post(customerApi.getAllStreet())
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({"districtId": parseInt(req.body.districtId)})
    .end(function (response) {
      var data = response.body.repData;
      if (data === undefined) {
        res.json({status: 0, msg: '服务异常'});
        return;
      }

      if (data.status) {
        res.json({status: data.status, street: data.street});
      } else {
        res.json({status: data.status, msg: data.msg});
      }
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('my', { title: '我的-好好卖' });
});

module.exports = router;

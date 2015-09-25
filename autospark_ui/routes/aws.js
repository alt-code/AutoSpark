var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('provider', {'title': 'AutoSpark', 'provider': 'AWS', link: '/aws/create'});
});

router.get('/create', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS'});
});

module.exports = router;

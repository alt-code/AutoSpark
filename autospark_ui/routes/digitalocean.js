var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('provider', {'title': 'AutoSpark', 'provider': 'Digital Ocean', link: '/digitalocean/create'});
});

router.get('/create', function (req, res, next) {
  res.render('digitalocean_create', {'title': 'Create Cluster on Digital Ocean'});
});

module.exports = router;
var express = require('express');
var router = express.Router();
var small = require('../templates/aws/small.json');
var medium = require('../templates/aws/medium.json');
var large = require('../templates/aws/large.json');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('provider', {'title': 'AutoSpark', 'provider': 'AWS', link: '/aws/create'});
});

router.get('/create', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': '', 'count': '', 'type': '', 'region': '', 'key_name': '', 'security_group': '' });
});


/* Post routes for the template configs*/
router.post('/create/small', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': small.name, 'count': small.count, 'type': small.type, 'region': small.region, 'key_name': small.key_name, 'security_group': small.security_group });
});

router.post('/create/medium', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': medium.name, 'count': medium.count, 'type': medium.type, 'region': medium.region, 'key_name': medium.key_name, 'security_group': medium.security_group });
});

router.post('/create/large', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': large.name, 'count': large.count, 'type': large.type, 'region': large.region, 'key_name': large.key_name, 'security_group': large.security_group });
});

/* Get routes to the template configs */
router.get('/create/small', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': small.name, 'count': small.count, 'type': small.type, 'region': small.region, 'key_name': small.key_name, 'security_group': small.security_group });
});

router.get('/create/medium', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': medium.name, 'count': medium.count, 'type': medium.type, 'region': medium.region, 'key_name': medium.key_name, 'security_group': medium.security_group });
});

router.get('/create/large', function (req, res, next) {
  res.render('aws_create', {'title': 'Create Cluster on AWS', 'name': large.name, 'count': large.count, 'type': large.type, 'region': large.region, 'key_name': large.key_name, 'security_group': large.security_group });
});

module.exports = router;

var express = require('express');
var mqtt = require('mqtt');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {
  connected: true
  });
});

module.exports = router;
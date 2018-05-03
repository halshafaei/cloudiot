var express = require('express');
var mqtt = require('mqtt');
var router = express.Router();
var url = require('url');

var mqtt_url = process.env.CLOUDMQTT_URL || 'mqtt://rfpudlok:ZOLKJsRlsUHL@m14.cloudmqtt.com:16896';
var topic = process.env.CLOUDMQTT_TOPIC || 'x';
var client = mqtt.connect(mqtt_url);



var sessionChecker = (req, res, next) => {
    console.log(req.cookies.user_sid);
    if (req.session.user && req.cookies.user_sid) {
      next();
    } else {
        res.redirect("/login");
    }    
};
/* GET home page. */
router.get('/',sessionChecker, function(req, res, next) {
  var config =  url.parse(mqtt_url);
  config.topic = topic;
  res.render('index', {
	connected: client.connected,
	config: config
  });
});

client.on('connect', function() {
  router.post('/publish', function(req, res) {
	var publishedmsg = JSON.stringify({
	  message: req.body.msg
	}); 
  client.publish(topic, publishedmsg, function() {
    res.writeHead(204, { 'Connection': 'keep-alive' });
    res.end();
  });
});

  router.get('/stream', function(req, res) {
    // send headers for event-stream connection
    // see spec for more information
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write('\n');

    // Timeout timer, send a comment line every 20 sec
    var timer = setInterval(function() {
      res.write('event: ping' + '\n\n');
    }, 20000);

    client.subscribe(topic, function() {
      client.on('message', function(topic, msg, pkt) {
		//res.write("New message\n");
		// var json = JSON.parse(msg);
        // res.write("data: " + json.date + ": " + json.msg + "\n\n");
        res.write("data: " + msg + "\n\n");
        const MongoClient = require('mongodb').MongoClient;
        const MONGO_URL = 'mongodb://iot:123456789@ds255319.mlab.com:55319/iot';
        MongoClient.connect(MONGO_URL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("iot");
        // var myobj = { date: json.date , msg: json.msg };
        var myobj = { date: new Date() , msg: msg.toString() };
        console.log(msg.toString());
        dbo.collection("readings").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
  });
});

      });
    });
  });
});

module.exports = router;

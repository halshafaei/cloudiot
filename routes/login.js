var app = require('express');
var router = app.Router();
var url = require('url');
var User=require('../lib/user');
var app=require('../lib/user');
var session = require('express-session')
var cookieParser = require('cookie-parser');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('login', {
  connected: true
  });
});

router.post('/', function(req, res) {
  
  var userid= req.body.userid;
  var pswrd= req.body.pswrd;
  console.log(userid);
  console.log(pswrd);

  
  User.findOne({username:userid,password:pswrd}, function(err,user){
    if(err){
      console.log(err);
      console.log("error");
      return res.status(500).send();
      
    }

    console.log(user);
    if(!user)
      return res.redirect("/login");
    // return res.status(200).send();
    req.session.user = user
    res.redirect('/index')

    
  

  }); 
    
  
  
});
  
module.exports = router;
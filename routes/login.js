var express = require('express');
var router = express.Router();
var url = require('url');
var User=require('../lib/user');

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
      return res.status(500).send();
      
    }

    console.log(user);
    if(!user)
      return res.redirect("/");
    // return res.status(200).send();
    res.redirect('index')

    
  

  }); 
    
  
  
});
  
module.exports = router;
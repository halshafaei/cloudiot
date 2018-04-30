var mongoose=require('mongoose');
const MONGO_URL = 'mongodb://iot:123456789@ds255319.mlab.com:55319/iot';
mongoose.connect(MONGO_URL);
mongoose.Promise= global.Promise
var db = mongoose.connection;

var userSchema=new mongoose.Schema({
  username:{type:String,unique:true},
  password: {type:String}
  
});

var User=mongoose.model('users',userSchema);
module.exports= User;
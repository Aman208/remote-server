const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();



  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});
   
 

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken= function(token) {
  var User = this;
  var decode;
  try{
    decode = jwt.verify(token , process.env.JWT_SECRET);
  }
  catch(e){
    return  Promise.reject();
  }

  return User.findOne({
    '_id' : decode._id ,
    'tokens.token' : token ,
    'tokens.access' :'auth'

  })

}

UserSchema.statics.findByEmail = function(email){
  var User = this;

  return User.findOne({
    email: email
  })


}

UserSchema.pre('save', function(next) {
  let user = this;

   if(user.isModified('password')){
    
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
})
  
   }
   else{
    next();
   }


});

UserSchema.methods.removeToken = function(token){
  let user = this;

  return user.update({
    $pull : { tokens : {token : token}}
  })

}

var User = mongoose.model('User', UserSchema);

module.exports = {User}
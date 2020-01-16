
var express = require('express')
var router = express.Router()
var {User} = require('../models/user');
const _ = require('lodash');
var bcrypt = require('bcryptjs');
var {authenticate} = require('../middleware/authenticate');


router.post('/', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

router.post('/login', (req, res) => { 

  var body = _.pick(req.body, ['email', 'password']);
  User.findByEmail(body.email).then( (user) => {
    
    if(!user){
       return  Promise.reject();
    }
     bcrypt.compare(body.password, user.password).then( respo => {
        if(respo === true)
        {  user.generateAuthToken().then((token) => {
          res.header('x-auth', token).send(user);
        })   
        }
        else{

           res.status(200).send("Password Does Not MAtch");
        }
  })

  }).catch( e =>
  {
     res.status(401).send(e);
  })

})

router.delete('/logout' ,authenticate , (req , res) =>{

  req.user.removeToken(req.token).then( () =>{
    res.status(200).send("Logout done")
  }).catch((e) =>{
    res.status(400).send(e);
  })

})






router.get('/me'  , authenticate  , (req , res) =>{
  
  res.send(req.user);

})

  module.exports = router;
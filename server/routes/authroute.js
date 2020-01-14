
var express = require('express')
var router = express.Router()
var {User} = require('../models/user');
const _ = require('lodash');


router.post('/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then((user) => {
      res.send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

  module.exports = router;

var express = require('express')
var router = express.Router()
var {Todo} = require('../models/todo');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {authenticate } = require('../middleware/authenticate');

router.post('/', authenticate , (req, res) => {
    var todo = new Todo({
      text: req.body.text ,
      _creater : req.user._id
    });
  
    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  router.get('/', authenticate ,(req, res) => {
    Todo.find({_creater : req.user._id }).then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
  });
  
  router.get('/:id', authenticate , (req, res) => {
    var id = req.params.id;
  

    if (!ObjectID.isValid(id)) {
      return res.status(404).send("No Result Found");
    }
  
    Todo.findOne({
      _id : id , _creater : req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send("No Result Found");
      }
      
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  });
  
  router.delete('/:id',authenticate ,  (req, res) => {
    var id = req.params.id;
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findByIdAndRemove({
      _id : id , _creater : req.user._id
    }).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    });
  });
  
  router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
  
    Todo.findOneAndUpdate({
      _id : id , _creater : req.user._id
    }, {$set: body}, {new: true}
    ).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })
  });
  
  module.exports = router;
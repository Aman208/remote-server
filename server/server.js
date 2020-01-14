const express = require('express');
var app = express();
const port = process.env.PORT || 3000;


  
const bodyParser = require('body-parser');
var authroute = require('./routes/authroute');
var todoroute = require('./routes/todoroute');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());


var mongoose = require('mongoose');
try{
mongoose.Promise = global.Promise;
var MONGODB_URI = 'mongodb+srv://aman208:atlas208@cluster0-ss781.mongodb.net/TodoApp?retryWrites=true&w=majority';

mongoose.connect( MONGODB_URI, {useNewUrlParser : true ,useUnifiedTopology: true ,
  useCreateIndex: true,
  useFindAndModify: false
 } ).then(con=>{
    console.log('Databse connected successfully');
    
}).catch ( err => console.log(err));

}


catch{
  console.log("error");
}



app.use('/todo', todoroute);
app.use('/auth' , authroute);



app.listen(port, () => {
  console.log(`Started up at port ${port}`);
  
});

module.exports = {app};

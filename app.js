const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

console.log(db)

//Check Connection
db.once('open', function(){
  console.log('connected to MONGO DB!!')
});

//Checking for DB errors
db.on('error', function(){
  console.log(err);
});

//init app
const app = express();

//Bringing in the model
let Article = require('./models/article');

//load view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Home Route
app.get('/', function(req, res){

  Article.find({}, function(err, articles){
    if (err){
      console.log(err);
    }else {
      console.log(articles);
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

//Add route 
app.get('/articles/add', function(req,res){
  res.render('add', {title: 'add article'})
});

//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});
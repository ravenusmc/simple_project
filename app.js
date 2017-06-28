const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;
//Bringing in the model
let Article = require('./models/article');

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

//Bringing in body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//load view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setting up public folder 
app.use(express.static(path.join(__dirname, 'public')));


//Home Route
app.get('/', function(req, res){

  Article.find({}, function(err, articles){
    if (err){
      console.log(err);
    }else {
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

//add Submit Post Route
app.post('/articles/add', function(req,res){
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err){
    if (err){
      console.log(err);
      return;
    }else {
      res.redirect('/');
    }
  });
});

//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});


































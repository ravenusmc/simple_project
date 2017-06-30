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

//Get Single Article:
app.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  });
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

//Load Edit Form
app.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      article: article
    });
  });
});

//Update Articles
app.post('/articles/edit/:id', function(req,res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if (err){
      console.log(err);
      return;
    }else {
      res.redirect('/');
    }
  });
});

//Deleting route-Don't forget to add in the ajax request
app.delete('/article/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
      if (err){
        console.log(err);
      }
      res.send('Success!');
    });
});

//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});


































const express = require('express');
const path = require('path');

//init app
const app = express();

//load view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Home Route
app.get('/', function(req, res){
  let articles = [
    {
      id:1,
      title:'One',
      author:'Brad',
      body: 'One One'
    },
    {
      id:2,
      title:'Two',
      author:'Brad',
      body: 'One One'
    },    
    {
      id:3,
      title:'Three',
      author:'Brad',
      body: 'One One'
    }
  ];
  res.render('index', {
    title: 'Hello Mike',
    articles: articles
  })
});

//Add route 
app.get('/articles/add', function(req,res){
  res.render('add', {title: 'add article'})
});

//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});
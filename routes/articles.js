const express = require('express');
const router = express.Router();

//Bringing in the model
let Article = require('../models/article');

router.get('/add', function(req,res){
  res.render('add', {title: 'add article'})
});

//Get Single Article:
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article', {
      article: article
    });
  });
});

//add Submit Post Route
router.post('/add', function(req,res){
  //validating 
  req.checkBody('title', 'Title is Required').notEmpty();
  req.checkBody('author', 'Author is Required').notEmpty();
  req.checkBody('body', 'Body is Required').notEmpty();

  //Get Errors
  let errors = req.validationErrors();
  if(errors){
    res.render('add', {
      title: 'Add Article',
      errors:errors
    });
  }else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if (err){
        console.log(err);
        return;
      }else {
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }


});

//Load Edit Form
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article', {
      article: article
    });
  });
});

//Update Articles
router.post('/edit/:id', function(req,res){
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
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

//Deleting route-Don't forget to add in the ajax request
router.delete('/:id', function(req, res){
    let query = {_id:req.params.id};

    Article.remove(query, function(err){
      if (err){
        console.log(err);
      }
      res.send('Success!');
    });
});

module.exports = router;
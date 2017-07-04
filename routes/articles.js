const express = require('express');
const router = express.Router();

//Bringing in the models
let Article = require('../models/article'); //article model
let User = require('../models/user'); //user model

router.get('/add', function(req,res){
  res.render('add', {title: 'add article'})
});

//Get Single Article:
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    User.findById(article.author, function(err,user){
      res.render('article', {
        article: article, 
        author: user.name
      });
    });
  });
});

//add Submit Post Route
router.post('/add', ensureAuthenticated, function(req,res){
  //validating 
  req.checkBody('title', 'Title is Required').notEmpty();
  //req.checkBody('author', 'Author is Required').notEmpty();
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
    article.author = req.user._id;
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
    if (article.author != req.user._id){
      req.flash('danger', 'Not Allowed');
      res.redirect('/');
    }
    res.render('edit_article', {
      article: article
    });
  });
});

//Update Articles
router.post('/edit/:id', ensureAuthenticated, function(req,res){
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
    if(!req.user._id){
      res.status(500).send();
    }

    let query = {_id:req.params.id};

    Article.findById(req.params.id, function(err, article){
      if(article.author != req.user._id){
        res.status(500).send();
      }else{
        Article.remove(query, function(err){
          if (err){
            console.log(err);
          }
          res.send('Success!');
        });
      }
    });
});

//Access Control 
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }else{
    req.flash('Danger', 'Please Login');
    res.redirect('/users/login');
  }
}

module.exports = router;







































const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//init app
const app = express();

//Model code
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

//End of Model Code 

//Bringing in body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//load view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setting up public folder 
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUnitialized: true
}))

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express validator Middle ware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


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

//Route files 
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


//Start Server
app.listen(3000, function(){
  console.log('Server Started on port 3000...')
});


































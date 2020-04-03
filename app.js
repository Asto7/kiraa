// server start: nodemon app.js
// mongodb start (form workspace folder): ../mongostart
const Handlebars=require('handlebars');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const exphbs=require('express-handlebars');
const app = express();
const passport = require('passport');
// load routes
const FM = require('./routes/FM');
const users = require('./routes/users').a;
// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/database');

var url='mongodb://localhost:27017/spider-laterals';
// connect to mongoose
mongoose.connect(url,
{useNewUrlParser: true}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.log(err);
});



// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}));
app.set('view engine', 'handlebars');

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'public')));

// method override
app.use(methodOverride('_method'));

// express session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true

}));

// adding passport middleware
// it is very important to add this after the express session
app.use(passport.initialize());
app.use(passport.session());

// flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg'); // needed for flash to work
  res.locals.error_msg = req.flash('error_msg');     // needed for flash to work
  res.locals.error = req.flash('error');             // needed for flash to work
  res.locals.user = req.user || null;                // needed for passport login/logout to work
  next();
})

app.get('/', (req, res) => {
    const title='Welcome to Asto Form!';
    res.render('index', {
       title: title
   });
});

app.get('/about', (req,res) => {
   res.render('about');
});


// use routes
app.use('/users', users);
app.use('/FM', FM);

app.get('*',(req,res)=>res.send("404, Page Not Found!"));
const port = 4000||process.env.port;

var server=app.listen(port, () => {
   console.log(`listening on port ${port}`);
});

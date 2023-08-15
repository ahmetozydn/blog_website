const express = require('express'); // express for creating server, returns a function
const app = express();
const mongoose = require('mongoose'); // ODM library to connect mongodb
const blogRoutes = require('./routes/blog-routes');
const adminRoutes = require('./routes/admin');
const error = require('./controller/error');
const errorRoutes = require('./routes/error');
const auth  = require('./routes/auth');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const path = require('path'); // Require the path module



// connect to mongodb & listen for requests
const dbURI = process.env.mongodb;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // async task
  .then(result => app.listen(3000, () => { // fires callback function
    console.log("the server live in http://localhost:3000")
  })) 
  .catch(err => console.log("an error occured while trying to connect db."+err));



// listen for requests on port 3000, default host is localhost


// register view engine, Embedded JavaScript
app.set('view engine', 'ejs');
app.set('views', [
  path.join(__dirname, 'views'), // Default view directory
  path.join(__dirname, 'views/admin'), // Additional view directory for admin views
]);


// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false })); // get form details as body, body parser
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());
app.use(cors());
app.use(csurf({ cookie: true })); // Middleware to attach CSRF token to the response locals, Configure CSRF middleware


const store = new MongoDBStore({
  uri: process.env.mongodb,
  collection: 'sessions'
});

app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: true,
  cookie : {
    maxAge: 3600000,
  },
  store: store
}));


// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
app.get('/about', (req, res) => {
  res.render('about',  { title: 'About',isAuth : req.session.isAuth} );
});
app.use('/user', auth);
app.use('/blogs', blogRoutes);
app.use('/admin', adminRoutes);
app.use(error.errorPage);


/*   app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  }); */

/* app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
}); */

/* 
app.delete('/blogs/:id', (req, res) => { // that doesn't work
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}); */

// 404 page
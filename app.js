const express = require('express'); // express for creating server, returns a function
const app = express();
const mongoose = require('mongoose'); // ODM library to connect mongodb
const Blog = require('./models/blog'); // import Blog model
const blogRoutes = require('./routes/blog-routes');
const { MongoClient, ObjectId } = require('mongodb');
const error = require('./controller/error');
const errorRoutes = require('./routes/error');
const auth  = require('./routes/auth');
const User = require('./models/user');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const csurf = require('csurf');


// connect to mongodb & listen for requests
const dbURI = process.env.mongodb;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // async task
  .then(result => app.listen(3000, () => { // fires callback function
    console.log("the server live in http://localhost:3000")
  })) 
  .catch(err => console.log(err));



// listen for requests on port 3000, default host is localhost


// register view engine, Embedded JavaScript
app.set('view engine', 'ejs');
// app.set('views','./views'); default folder for view engines is view folder
/* // mongoose & mongo tests
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  })

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
}); */


// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false })); // get form details as body, body parser
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser());
app.use(csurf({ cookie: true })) // Middleware to attach CSRF token to the response locals
app.use(cors());


app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/single-blog', (req, res) => {
  Blog.findById('64d0cb6da360950533e2df63')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

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





app.use('/user', auth);

// custom middlewares can be created
/* app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next(); // call the next middleware
}); */

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// about page
app.get('/about', (req, res) => {
  console.log("the value of isAuth is "+req.session.isAuth);
  res.render('about',  { title: 'About',isAuth : req.session.isAuth } );
});

/*   app.get('/blogs', (req, res) => {
    Blog.find().sort({ createdAt: -1 })
      .then(result => {
        res.render('index', { blogs: result, title: 'All blogs' });
      })
      .catch(err => {
        console.log(err);
      });
  }); */

app.use('/blogs', blogRoutes);


app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details',  isAuth : req.session.isAuth });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/blogs/update', (req, res) => {
  const content = req.body;
  console.log(req.body);

  Blog.findByIdAndUpdate({ "_id": content.id },
    {
      $set: {
        title: content.title,
        snippet: content.snippet,
        body: content.body
      }
    }
  )
  .catch(err => {
    console.log(err);
  });
  //Blog.updateOne(filter, update)
  /*   const result = Blog.updateOne(content.id, update);
    
    console.log("the value of the result is "+result);
  
    if (result.machedCount > 0) {
      console.log("updated successfully");
    } else {
      console.log("error occured while updating...");
    } */
});



app.delete('/blogs/:id', (req, res) => { // that doesn't work
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use(error.errorPage);
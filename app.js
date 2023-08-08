const express = require('express'); // express for creating server, returns a function
const app = express();
const mongoose = require('mongoose'); // ODM library to connect mongodb
const Blog = require('./models/blog'); // import Blog model
const blogRoutes = require('./routes/blog-routes');
const { MongoClient, ObjectId } = require('mongodb');

const cors = require('cors');

// connect to mongodb & listen for requests
const dbURI = process.env.mongodb;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // async task
  .then(result => app.listen(3000)) // fires callback function
  .catch(err => console.log(err));



// listen for requests on port 3000, default host is localhost
app.listen(3001);

// register view engine, Embedded JavaScript
app.set('view engine', 'ejs');

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

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Parse incoming JSON requests
app.use(cors());

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

/* // root page, express routing, the traditional approach is switch-case
 app.get('/', (req, res) => {
    const blogs = [
      {title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      {title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur'},
      {title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur'},
    ];
    res.render('index', { title: 'Home', blogs }); // rendering the template-webpage
  }); */

// about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});


app.get('/', (req, res) => {
  res.redirect('/blogs');
});
// create page
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
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
      res.render('details', { blog: result, title: 'Blog Details' });
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
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
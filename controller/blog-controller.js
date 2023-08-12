const Blog = require('../models/blog');

// make data manupulation and set the view, interaction between view and model
const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 }) // process the data
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' }); // set view side variables
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id; // process the url
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' }); // update-set-pass data the view
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' }); // handle user interactions
    })
    .catch(err => {
      console.log(err);
    });
}



module.exports = {
  blog_index, 
  blog_details, 
  blog_create_get, 
  blog_create_post, 
  blog_delete
}
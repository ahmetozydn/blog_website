const ObjectId = require('mongoose/lib/schema/objectid');
const Blog = require('../models/blog');
var mongoose = require('mongoose');
// make data manupulation and set the view, interaction between view and model
const blog_index = (req, res) => {
  console.log("the value of isAuth is " + req.session.isAuth);
  Blog.find().sort({ createdAt: -1 }) // process the data
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs', isAuth: req.session.isAuth }); // set view side variables
    })
    .catch(err => {
      console.log(err);
    });
}

const   user_blogs = async (req, res, next) => {
  try {
    await Blog.find({ authorId: req.session.user._id }).then((result)=>{
      return res.render('user-blogs',{isAuth: req.session.isAuth, blogs: result, title: "My Blogs"});
    })
  } catch (err) { console.log(err); }
}

const blog_details = (req, res) => {
  const id = req.params.id; // process the url
  Blog.findById(id)
    .then(result => {
      console.log(result);
      res.render('details', { blog: result, title: 'Blog Details', isAuth: req.session.isAuth}); // update-set-pass data the view
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_create_get = (req, res) => {
  console.log("the value of csrfToken");
  res.render('create', { title: 'Create a new blog', isAuth: req.session.isAuth, csrfToken: req.csrfToken()});
}

const blog_create_post = (req, res, next) => {
  //const blog = new Blog(req.body);
  const blog = { authorId: req.session.user._id, ...req.body };
  console.log("the user id is " + req.session.user._id);
  const newBlog = new Blog(blog);
  console.log('the new blog is +' + newBlog);
  newBlog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = async (req, res) => {
  console.log("inside blog delete");
  const id = req.body.id;
 await Blog.findByIdAndDelete(id)
    .then(result => {
        console.log("result is ok");
        return res.json({redirect: '/blogs'});
    })
    .catch(err => {
      console.log(err);
    });
}

const post_get = async (req, res, next) => {
    const id = req.params.id; 
    //const postId = new ObjectId(id);
   // var postId = new mongoose.Types.ObjectId(id);

   // console.log(typeof postId);
    console.log("start"+id+"end");
    if(mongoose.Types.ObjectId.isValid(id)) {
      await Blog.findById(id)
      .then((result)=>{
       if(!result){
         return res.json({message: "post not found"});
       }
       console.log("inside condition the id is"+id);
       res.render('post-details', { title: 'Post Details', post: result, isAuth: req.session.isAuth, token: req.csrfToken()}); // update-set-pass data the view
     })
    }else{
      console.log("the id is"+id+"last");
      res.json({message: "not a valid id."});
    }
}

module.exports = {
  blog_index,
  blog_details,
  blog_create_get,
  blog_create_post,
  blog_delete,
  user_blogs,
  post_get
}
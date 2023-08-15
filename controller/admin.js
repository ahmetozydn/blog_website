const axios = require('axios');
const Blog = require('../models/blog');
const User = require('../models/user');
const  blogController  = require('./blog-controller');


let blogs = {};
const get_dashboard =async function (req, res, next) {
  console.log("the csrf inside get_dashboard is ",req.session.token);
  console.log("inside dashboard");
  const token = req.session.token;
  console.log("token ",token);
  if (req.session.isAuth && req.session.user.role === 'admin') {
      fetch('http://localhost:3000/blogs/all-blogs', { 
      method: "get",
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.json()).then(data => {
      blogs = data;
      fetch('http://localhost:3000/user/all-users', { 
        method: "get",
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(response => response.json()).then(users => {
        return res.render('dashboard',{posts:blogs,users:users});
      })
    })


  } else {
    return res.redirect('/blogs'); // Redirect unauthorized users
  }
}

module.exports = {
  get_dashboard
}

/*     let blogs = new Blog();
     Blog.find().sort({ createdAt: -1 })
    .then(result => {
        blogs = result;
        User.find().sort({ createdAt: -1 })
        .then(users => {
          res.render('dashboard',{posts: blogs, users: users});
        })
        .catch(err => {
          console.log(err);
          res.json({status: "fail", message: "Failed to load all blogs."});
        }); 
    })
    .catch(err => {
      console.log(err);
      res.json({status: "fail", message: "Failed to load all blogs."});
    });  
 */
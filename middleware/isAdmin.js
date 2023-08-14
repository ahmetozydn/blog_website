const isUser = (req, res, next) =>{
    if (req.session.isAuth && req.session.user.role === 'user') {
      return next();
    }
    res.redirect('/login'); // Redirect unauthorized users to login page
  }

  const isAdmin = async (req, res, next) =>{
    if (req.session.isAuth && req.session.user.role === 'admin') {
     return res.redirect('/admin/dashboard');
    }
    console.log("the requires url is "+req.originalUrl);
    return res.redirect('/blogs'); // Redirect unauthorized users
  }

  module.exports = {
    isAdmin,
    isUser
  }
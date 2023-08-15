const isUser = (req, res, next) =>{
    if (req.session.isAuth && req.session.user.role === 'user') {
      return next();
    }
    res.redirect('/login'); // Redirect unauthorized users to login page
  }

  const isAdmin = async (req, res, next) =>{
    if (req.session.isAuth && req.session.user.role === 'admin') {
     return next(); // got to next middleware to open dashboard
    }else{
      return res.redirect('/blogs'); // Redirect unauthorized users
    }
  }

  const redirectTo = async (req, res, next) =>{
    if (req.session.isAuth && req.session.user.role === 'admin') {
      console.log("the csrf inside redirectTo is "+req.csrfToken());
     return res.redirect('/admin/dashboard'); // got to next middleware to open dashboard
    }else{
      return res.redirect('/blogs'); // Redirect unauthorized users
    }
    console.log("the requires url is "+req.originalUrl);
  }

  module.exports = {
    isAdmin,
    isUser,
    redirectTo
  }
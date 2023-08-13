const { lowerCase, find } = require("lodash");
const bcrypt = require('bcrypt');
const User = require("../models/user");
const error = require("./error");

const getLogin = function (req, res) {
  res.render('login', { errorOccured: req.session.errorOccured, csrfToken: req.csrfToken() });
  delete req.session.errorOccured;
  //console.log("the user name is "+req.body.username);
};

const getRegister =  function (req, res) {
  res.render('register', { errorMessage: req.session.errorMessage, csrfToken: req.csrfToken() });
  delete req.session.errorMessage
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  console.log(email, password);
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        // Email not found in the database
        req.session.errorOccured = true;
        req.session.save((err) => {
          console.log(err);
          return res.redirect('login');
        })
      }
      const hashedPassword = user.password;
      bcrypt.compare(password, hashedPassword, (compareErr, result) => {
        if (compareErr) {
          console.error(compareErr);
          return;
        }
        if (result) {
          // Passwords match, login successful
          req.session.isAuth = true;
          req.session.user = user
          return req.session.save((err) => {
            console.log(err);
            res.redirect('/blogs');
          });

        } else {
          // Passwords do not match
          req.session.errorOccured = true
          req.session.save((err) => {
            console.log(err);
            //delete req.session.errorOccured
            return res.redirect('login');
          })
        }
      })

    }).catch((error) => {
      console.log(error);
    })
}



const register = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  User.findOne({
    $or: [
      { username: username },
      { email: email }
    ]

  })
    .then((user) => {
      if (user) {
        if (user.username === username) {
          console.log("inside user.username")
          req.session.errorMessage = "username is already in use.";
          req.session.save((err) => {
            if (err) { console.log(err); }
            return res.redirect('register');
          })
        }
        else if (user.email === email) {
            console.log("inside user.mail")
            req.session.errorMessage = "e-mail is already in use.";
            req.session.save((err) => {
              if (err) { console.log(err); } // consider sending textfield credentials again
              return res.redirect('register');
            })
          }
        return;
      }
      const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword
      })
      newUser.save().then((err) => {
        if (err) { console.log(err); }
        req.session.isAuth = true; // error handling?
        return res.redirect('/blogs');
      })

    })

};
const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('login');
  });
};

module.exports = {
  getLogin,
  getRegister,
  login,
  register,
  logout
}
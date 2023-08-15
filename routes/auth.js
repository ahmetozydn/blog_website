const express = require('express');
const authController = require('../controller/auth');
const csrf = require('../middleware/csrf');
const roleBasedRedirect  = require('../middleware/isAdmin');
const router  = express.Router();


router.get('/login', csrf, authController.getLogin);
router.get('/logout',authController.logout);
router.get('/register',csrf, authController.getRegister);
router.get('/all-users', authController.get_all_users);
router.post('/login'/* ,csrf */,authController.login_post /* , roleBasedRedirect.redirectTo */);
router.post('/register',authController.register,roleBasedRedirect.redirectTo);


module.exports =  router;
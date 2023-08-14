const express = require('express');
const authController = require('../controller/auth');
const csrf = require('../middleware/csrf');
const roleBasedRedirect  = require('../middleware/isAdmin');
const router  = express.Router();


router.get('/login',csrf, authController.getLogin);
router.get('/logout',authController.logout);
router.get('/register',csrf, authController.getRegister);
router.post('/login',authController.login, roleBasedRedirect.isAdmin);
router.post('/register',authController.register,roleBasedRedirect.isAdmin);


module.exports =  router;
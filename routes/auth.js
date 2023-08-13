const express = require('express');
const authController = require('../controller/auth');
const csrf = require('../middleware/csrf');
const router  = express.Router();


router.get('/login',csrf, authController.getLogin);
router.get('/logout',authController.logout)
router.get('/register',csrf, authController.getRegister);
router.post('/login',authController.login);
router.post('/register',authController.register);


module.exports =  router;
const express = require('express');
const adminController = require('../controller/admin');
const csrf = require('../middleware/csrf');
const router  = express.Router();
const middleware = require('../middleware/isAdmin');

router.get('/dashboard' /* ,middleware.isAdmin */, adminController.get_dashboard);

module.exports =  router;
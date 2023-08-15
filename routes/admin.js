const express = require('express');
const adminController = require('../controller/admin');
const csrf = require('../middleware/csrf');
const middleware = require('../middleware/isAdmin');
const router  = express.Router();

router.get('/dashboard'/*,csrf , middleware.isAdmin  */, adminController.get_dashboard);



module.exports =  router;
const error = require('../controller/error');
const express  = require('express');
const router = express.Router();

router.get('/',error.errorPage);

module.exports = router;
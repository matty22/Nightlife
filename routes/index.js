var express = require('express');
var router = express.Router();

// Serves home page upon hitting the / route
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;

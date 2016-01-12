var express               = require('express');
var router                = express.Router();
// Parses information from POST
var bodyParser            = require('body-parser');
// Used to manipulate POST methods
var methodOverride        = require('method-override');
var passport              = require("passport");
var usersController       = require('../controllers/users');
var staticsController     = require('../controllers/statics');

router.route('/')
  .get(staticsController.home);

module.exports = router;

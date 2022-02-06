var express = require('express');
var router = express.Router();

// Module dependancies.
var { currentTimeString } = require('../utils/time.utils')

// ALL ping.
router.all('/ping', function(req, res) {
  let bind = {
    status: "success",
    message: `request received at ${currentTimeString()}`
  };
  res.status(200).json(bind);
});

// Demo endpoints.
var demoRouter = require('./demo.routes');
router.use('/demo', demoRouter);


module.exports = router;

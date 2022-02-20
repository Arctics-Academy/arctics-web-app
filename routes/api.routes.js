// setup
const express = require('express');
const router = express.Router();

// packages & modules
const { currentTimeString } = require('../utils/time.utils')


// api routes
// ping - basic server test
router.all('/ping', function(req, res) {
  let bind = {
    status: "success",
    message: `request received at ${currentTimeString()}`
  };
  res.status(200).json(bind);
});

// demo - everything before product launch
const demoRouter = require('./demo.routes');
router.use('/demo', demoRouter);

// consultant - everything consultant side
const consultantRouter = require('./consultant.routes');
router.use('/consultant', consultantRouter);

// system - admin console (needs to be updated)
const systemRouter = require('./system.routes')
router.use('/system', systemRouter)


// exports
module.exports = router;

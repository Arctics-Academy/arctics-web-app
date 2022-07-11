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
	}
	res.status(200).json(bind)
})

// demo - everything before product launch
const demoRouter = require('./demo.routes')
router.use('/demo', demoRouter)

// consultant - everything consultant side
const consultantRouter = require('./consultant.routes')
router.use('/consultant', consultantRouter)

// student - everything student side
const studentRouter = require('./student.routes')
router.use('/student', studentRouter)

// meetings - everything about booking / canceling meetings
const meetingRouter = require('./meeting.routes')
router.use('/meeting', meetingRouter)

// user - everything with user management, such as egister & login
const userRouter = require('./user.routes')
router.use('/user', userRouter)

// system - admin console (needs to be updated)
const systemRouter = require('./system.routes')
router.use('/system', systemRouter)

const testRouter = require('./test.routes')
router.use('/test', testRouter)


// exports
module.exports = router;

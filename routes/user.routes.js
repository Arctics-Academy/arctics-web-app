const express = require('express')
const router = express.Router()

const { DuplicateUserError } = require('../utils/error.utils')
require('../controllers/user.controllers')

router.post('/consultant/register', async (req, res) => {
    try {
        await registerConsultant(req.body)
    }
    catch (e) {
        if (typeof e === DuplicateUserError) {
            res.status(400).json({ status: "failed", message: "duplicate consultant was found"})
        }
        else {
            console.error(e)
            res.status(500).json({ status: "error", message: "internal error; try again later"})
        }
    }
})

router.post('/consultant/login', async (req, res) => {
    try {
        result = await loginConsultant(req.body)
        if (result.status === "success") {
            req.session.auth.consultantAuth = true
		    req.session.auth.consultantId = result.data.id
            res.status(200).json(result)
        }
        else {
            res.status(400).json(result)
        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal error; try again later"})
    }
})

router.get('/consultant/email-otp', async (req, res) => {
    try {
        await sendEmailOTP(req.body)
        res.status(200).json({ status: "success", message: "email otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/email-otp', async (req, res) => {
    try {
        if (await matchEmailOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(400).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal error; try again later"})
    }
})

router.get('/consultant/mobile-otp', async (req, res) => {
    try {
        await sendMobileOTP(req.body)
        res.status(200).json({ status: "success", message: "mobile otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/mobile-otp', async (req, res) => {
    try {
        if (await matchMobileOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(400).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: "internal error; try again later"})
    }
})


// router.post('/student/register')
// router.post('/student/login')

// router.get('/student/email-otp')
// router.post('/student/email-otp')

// router.get('/student/mobile-otp')
// router.post('/student/mobile-otp')

module.exports = router
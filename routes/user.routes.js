const express = require('express')
const router = express.Router()

const { DuplicateUserError } = require('../utils/error.utils')
const { registerConsultant, loginConsultant, sendEmailOTP, matchEmailOTP, sendMobileOTP, matchMobileOTP, registerStudent, loginStudent, sendPasswordResetOtp, matchPasswordResetOtp } = require('../controllers/user.controllers')

router.post('/consultant/register', async (req, res) => {
    try {
        let data = await registerConsultant(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        if (e.name === "DuplicateUserError") {
            res.status(200).json({ status: "failed", message: "duplicate consultant was found"})
        }
        else {
            console.error(e)
            res.status(200).json({ status: "error", message: "internal error; try again later"})
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
            res.status(200).json(result)
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/logout', async (req, res) => {
    try {
        req.session.auth.consultantAuth = false
        req.session.auth.consultantId = null
        res.status(200).json({ status: "success", message: `consultant logout successful` })
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/email-otp/send', async (req, res) => {
    try {
        await sendEmailOTP(req.body)
        res.status(200).json({ status: "success", message: "email otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/email-otp/verify', async (req, res) => {
    try {
        if (await matchEmailOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(200).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/mobile-otp/send', async (req, res) => {
    try {
        await sendMobileOTP(req.body)
        res.status(200).json({ status: "success", message: "mobile otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/consultant/mobile-otp/verify', async (req, res) => {
    try {
        if (await matchMobileOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(200).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})


router.post('/student/register', async (req, res) => {
    try {
        let data = await registerStudent(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        if (e.name === "DuplicateUserError") {
            res.status(200).json({ status: "failed", message: "duplicate student was found"})
        }
        else {
            console.error(e)
            res.status(200).json({ status: "error", message: "internal error; try again later"})
        }
    }
})

router.post('/student/login', async (req, res) => {
    // try {
    //     result = await loginStudent(req.body)
    //     if (typeof(result) !== "string") {
    //         req.session.auth.studentAuth = true
	// 	    req.session.auth.studentId = result.id
    //         res.status(200).json({ status: "success", data: result })
    //     }
    //     else {
    //         res.status(200).json({ status: "failed", message: result })
    //     }
    // }
    try {
        result = await loginStudent(req.body)
        if (result.status === "success") {
            req.session.auth.studentAuth = true
		    req.session.auth.studentId = result.data.id
            res.status(200).json(result)
        }
        else {
            res.status(200).json(result)
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/student/email-otp/send', async (req, res) => {
    try {
        await sendEmailOTP(req.body)
        res.status(200).json({ status: "success", message: "email otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/student/email-otp/verify', async (req, res) => {
    try {
        if (await matchEmailOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(200).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/student/mobile-otp/send', async (req, res) => {
    try {
        await sendMobileOTP(req.body)
        res.status(200).json({ status: "success", message: "mobile otp sent"})
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/student/mobile-otp/verify', async (req, res) => {
    try {
        if (await matchMobileOTP(req.body)) {
            res.status(200).json({ status: "success", message: "email otp matched"})
        }
        else {
            res.status(200).json({ status: "failed", message: "email otp did not match"})
        }
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal error; try again later"})
    }
})

router.post('/reset-password/send-otp', async (req, res) => {
    // req.body
    // {
    //     identity: "string"
    //     email: "string"
    // }
    try {
        let payload = await sendPasswordResetOtp(req.body);
        res.status(200).json(payload);
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal server error, try again later"});
    }
});

router.post('/reset-password/match-otp', async (req, res) => {
    // req.body
    // {
    //     identity: "string"
    //     email: "string"
    //     code: "string"
    //     password: "string"
    // }
    try {
        let payload = await matchPasswordResetOtp(req.body);
        res.status(200).json(payload);
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: "internal server error, try again later"});
    }
});

module.exports = router
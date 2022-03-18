// Packages & Setup
const express = require('express')
const router = express.Router()

// Controllers
const StudentController = require('../controllers/student.controllers')


// Routes
router.post('/profile/get', async (req, res) => {
    // expect req.body
    // {
    //     id: "string"    
    // }
    try {
        let data = await StudentController.getStudentProfile(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch(e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get student profile with id ${req.body.id}` })
    }
})

router.post('/profile/update', async (req, res) => {
    // expect req.body
    // {
    //     id: "string",
    //     data: 
    //     {
    //         surname: "string" (optional)
    //         name: "string" (optional)
    //         school: "string" (optional)
    //     }
    // }
    try {
        await StudentController.studentUpdateProfile(req.body)
        res.status(200).json({ status: "success", message: `student ${req.body.id} profile update successful` })
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `student ${req.body.id} profile update failed` })
    }
})

router.post('/toolbar/notification-count/get', async (req, res) => {
    // req.body: 
    // { 
    //     id: "string"
    // }
    try {
        let data = await StudentController.getStudentNotificationCount(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get student notification count with id ${req.body.id}` })
    }
})

router.post('/toolbar/check-discount-code/verify', async (req, res) => {
    // req.body: 
    // {
    //     id: "string",
    //     discount: "string"
    // }
    try {
        let response = await StudentController.studentVerifyDiscountCode(req.body);
        res.status(200).json(response);
    }
    catch (e) {
        console.error(e);
        res.status(200).json({ status: "error", message: `student ${req.body.id} discount code check failed` });
    }
})


module.exports = router
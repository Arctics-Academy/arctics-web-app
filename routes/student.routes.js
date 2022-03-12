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


module.exports = router
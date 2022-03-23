// Packages & Setup
const express = require('express')
const router = express.Router()

// Controllers
const StudentController = require('../controllers/student.controllers')
const FilterController = require('../controllers/filter.controllers');


// Routes
// returns dashboard information
router.post('/dashboard/get', async function (req, res) {
    // req.body
    // {
    //     id: "string"
    // }
    try {
        let data = await StudentController.getStudentDashboard(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(200).json({ status: "error", message: `cannot get student dashboard info with id ${req.body.id}` })
    }
});

// returns student list information
router.post('/list/get', async (req, res) => {
    // req.body
    // {
    //     id: "string"
    // }
    try {
        let data = await StudentController.getStudentList(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(200).json({ status: "error", message: `cannot get student list info with id ${req.body.id}` })
    }
});

// adds items to student list
router.post('/list/add', async (req, res) => {
    // req.body
    // {
    //     id: "string"
    //     consultantId: "string"  
    // }
    try {
        await StudentController.studentAddToList(req.body)
        res.status(200).json({ status: "success", message: `consultant added to student list` })
    }
    catch (e) {
        console.log(e)
        res.status(200).json({ status: "error", message: `student (${req.body.id}) list update failed` });
    }
});

// deletes item from student list
router.post('/list/delete', async (req, res) => {
    // req.body
    // {
    //     id: "string"
    //     consultantId: "string"  
    // }
    try {
        await StudentController.studentDeleteFromList(req.body);
        res.status(200).json({ status: "success", message: `consultant deleted from student list` });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({ status: "error", message: `student (${req.body.id}) list update failed` });
    }
})

// clears student list
router.post('/list/clear', async (req, res) => {
    // req.body
    // {
    //     id: "string"
    // }
    try {
        await StudentController.studentClearList(req.body);
        res.status(200).json({ status: "success", message: `student consultant list cleared` });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({ status: "error", message: `student (${req.body.id}) list update failed` });
    }
});

// returns student profile information
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
        res.status(200).json({ status: "error", message: `cannot get student profile with id ${req.body.id}` })
    }
})

// updates student profile
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

// returns student notification count
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
        res.status(200).json({ status: "error", message: `cannot get student notification count with id ${req.body.id}` })
    }
})

// verfies entered discount code
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

// returns consultants from filter
router.post('/toolbar/filter', async (req, res) => {
    // req.body
    // {
    //     query: 
    //     {
    //         school: ["array", "of", "schools"],
    //         field: ["array", "of", "fields"],
    //         major: ["array", "of", "majors"]
    //     }
    // }
    try {
        let data = await FilterController.filterConsultants(req.body);
        res.status(200).json({ status: "success", data: data });
    } 
    catch (e) {
        console.error(e);
        res.send(200).json({ status: "error", message: `uncaught query controller error`});
    }
});


// Exports
module.exports = router
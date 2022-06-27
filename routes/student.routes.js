// Packages & Setup
const express = require('express')
const router = express.Router()

// Controllers & Middlewares
const StudentController = require('../controllers/student.controllers')
const FilterController = require('../controllers/filter.controllers');
const { MeetingPaymentUploadMiddleware } = require('../middlewares/upload.middlewares');


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

// returns notifications
router.post('/notifications/get', async (req, res) => {
    // req.body
    // {
    //     id: "string"
    // }
    try {
        let data = await StudentController.getStudentNotifications(req.body);
        res.status(200).json({ status: "success", data: data });
    }
    catch (e) {
        console.log(e);
        res.status(200).json({ status: "error", message: `uncaught student (${req.body.id}) get notification error`});
    }
});

// reads notification
router.post('/notifications/read', async (req, res) => {
    // req.body
    // { 
    //     id: "string"
    //     announcementIds: ["string"]
    //     notificationIds: ["string"] 
    // }
    try {
        await StudentController.studentReadNotifications(req.body);
        res.status(200).json({ status: "success", message: `student notifications read operation complete` });
    }
    catch (e) {
        console.error(e);
        res.status(200).json({ status: "error", message: `uncaught student (id: ${req.body.id}) read notification error` });
    }
})

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

// returns all meetings
router.post('/meetings/list/get', async function (req, res) {
    // req.body
    // {
    //     id: "string"
    // }
    try {
        let data = await StudentController.getStudentMeetings(req.body)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(200).json({ status: "error", message: `cannot get student meeting list with id ${req.body.id}` })
    }
})

// updates
// router.post('/meetings/submit-payment-proof', MeetingPaymentUploadMiddleware.single("meetingPaymentScan"), async (req, res) => {
//     // req.body (form-data)
//     // {
//     //     meetingId: "string"
//     //     meetingPaymentScan: file
//     // }
//     try {
//         await StudentController.studentSubmitPaymentProof(req.body, req.file);
//         res.status(200).json({ status: "success", message: `upload payment proof for meeting ${req.body.meetindId} successful` });
//     }
//     catch (e) {
//         console.error(e);
//         res.status(200).json({ status: "error", message: `upload payment proof for meeting ${req.body.meetingId} failed` });
//     }
// });

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
router.post('/tools/notification-count/get', async (req, res) => {
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
router.post('/tools/check-discount-code/verify', async (req, res) => {
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
router.post('/tools/filter', async (req, res) => {
    // req.body
    // {
    //     query: 
    //     {
    //         school: ["array", "of", "schools"], // (先不要) 只有一間學校
    //         field: ["array", "of", "fields"], // (先不要) 學群
    //         major: ["array", "of", "majors"] // 學系
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

// returns requested consultant profile obj
router.post('/tools/consultant-profile/get', async (req, res) => {
    // req.body
    // {
    //     studentId: "string",
    //     consultantId: "string"
    // }
    try {
        let data = await StudentController.studentViewConsultant(req.body);
        res.status(200).json({ status: "success", data: data });
    } 
    catch (e) {
        console.error(e);
        res.send(200).json({ status: "error", message: `uncaught student controller error`});
    }
})


// Exports
module.exports = router
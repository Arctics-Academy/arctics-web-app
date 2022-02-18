// App Modules
var express = require('express')
var router = express.Router()

// Controllers
const consultantController = require('../controllers/consultant.controllers')

// Routes
// returns whole consultant obj
// req.body: { id: "string" }
router.get('/dashboard', async function (req, res) {
    try {
        let data = await consultantController.getConsultantDashboard(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant dashboard info with id ${req.body.id}` })
    }
})

// returns all announcements & notifications
// req.body: { id: "string" }
router.get('/notification', async function (req, res) {
    try {
        let data = await consultantController.getConsultantNotifications(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant notifications with id ${req.body.id}` })
    }
})

// action: read notification
// req.body: { id: "string", announcementId: ["string"], notificationId: "string" }
router.post('/notificaiton/read', async (req, res) => {
    try {
        await consultantController.consultantReadNotifications(req.body.id, req.body.announcementId, req.body.notificationId)
        res.status(200).json({ status: "success", message: `consultant notifications read operation complete` })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `consultant notifications read opersation failed` })
    }
})

// returns meetings for +- 1 month
// req.body: { id: "string", date: "date" }
router.get('/meetings/calendar', async function (req, res) {
    try {
        let data = await consultantController.getConsultantMeetingsCalendar(req.body.id, req.body.date)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant calendar with id ${req.body.id}` })
    }
})

// returns all meetings
// req.body: { id: "string" }
router.get('/meetings/list', async function (req, res) {
    try {
        let data = await consultantController.getConsultantMeetingsList(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ status: "error", message: `cannot get consultant meeting list with id ${req.body.id}` })
    }
})

// action: cancel meeting
// req.body: { id: "string", meetingId: "string" }
// router.post('/meetings/cancel', async function(req, res) {
//     let result = await consultantController.consultantCancelMeeting(req.body.id, req.body.meetingId)
//     if (result) {
//         res.status(200).json({ status: "success", message: `meeting with ${req.meetingId} canceled successfully`})
//     }
//     else {
//         res.status(500).json({ status: "error", message: "cannot cancel meeting, try again later"})
//     }
// })

// action: view meeting meeting information
// req.body: { meetingId: "string" }
router.get('/meetings/questions-and-conditions', async (req, res) => {
    try {
        let data = await consultantController.getMeetingQuestionsAndConditions(req.body.meetingId)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get meeting details` })
    }
})

// returns purse & all transaction records
// req.body: { id: "string" }
router.get('/purse', async function (req, res) {
    try {
        let data = await consultantController.getConsultantPurse(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant purse with id ${req.body.id}` })
    }
}) 

// action: get consultant bank no
// req.body: { id: "string"}
router.get('/purse/bank-info', async (req, res) => {
    try {
        let data = await consultantController.getConsultantBankInfo(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant bank info with id ${req.body.id}`})
    }
})

// action: add bank account
// req.body: { id: "string", usage: "string", bankNo: "string", accountNo: "string" }
router.post('/purse/bank-info', async (req, res) => {
    try {
        await consultantController.consultantAddBankInfo(req.body.id, req.body)
        res.status(200).json({ status: "success", message: `consultant ${req.body.id} bank info added` })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot add consultant bank info` })
    }
})

// return consultant.id & consultant.profile obj
// req.body: { id: "string" }
router.get('/profile', async function (req, res) {
    try {
        let data = await consultantController.getConsultantProfile(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch(e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant profile with id ${req.body.id}` })
    }
})

// return consultant unread notification count
// req.body: { id: "string" }
router.get('/toolbar/notification-count', async (req, res) => {
    try {
        let data = await consultantController.getConsultantNotificationCount(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant notification count with id ${req.body.id}` })
    }
})


// Exports
module.exports = router
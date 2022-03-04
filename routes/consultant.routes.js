// App Modules
var express = require('express')
var router = express.Router()

// Controllers & Middleware
const consultantController = require('../controllers/consultant.controllers')
const { StudentIdUploadMiddleware, ProfilePhotoUploadMiddleware } = require('../middlewares/upload.middlewares')

// Routes
// returns whole consultant obj
// req.body: { id: "string" }
// tested
router.post('/dashboard/get', async function (req, res) {
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
// tested
router.post('/notifications/get', async function (req, res) {
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
// req.body: { id: "string", announcementId: ["string"], notificationId: ["string"] }
// tested
router.post('/notifications/read', async (req, res) => {
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
// tested
router.post('/meetings/calendar/get', async function (req, res) {
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
// tested
router.post('/meetings/list/get', async function (req, res) {
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
router.post('/meetings/questions-and-conditions/get', async (req, res) => {
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
router.post('/purse/get', async function (req, res) {
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
// tested
router.post('/purse/bank/get', async (req, res) => {
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
// tested
router.post('/purse/bank/update', async (req, res) => {
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
// tested
router.post('/profile/get', async function (req, res) {
    try {
        let data = await consultantController.getConsultantProfile(req.body.id)
        res.status(200).json({ status: "success", data: data })
    }
    catch(e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `cannot get consultant profile with id ${req.body.id}` })
    }
})

// action: add consultant student id scan
// req.body: { id: "string", studentIdScan: file }
router.post('/profile/student-id/update', StudentIdUploadMiddleware.single('studentIdScan'), async (req, res) => {
    try {
        await consultantController.consultantAddStudentId(req.body.id, req.file)
        res.status(200).json({ status: "success", message: `upload student id scan for consultant ${req.body.id} successful` })
    }
    catch (e) {
        console.error(e)
        res.status(500).json({ status: "error", message: `upload student id scan for consultant ${req.body.id} failed` })
    }
})

// action: update consultant profile
// req.body: { id: "string", data: profile object }
router.post('/profile/update', async (req, res) => {
    try {
        await consultantController.consultantUpdateProfile(req.body.id, req.body.profile)
        res.status(200).json({ status: "success", message: `consultant ${req.body.id} profile update successful` })
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `consultant ${req.body.id} profile update failed` })
    }
})

// action: add/update profile photo
// req.body: { id: "string", profilePhoto: file}
router.post('/profile/photo/update', ProfilePhotoUploadMiddleware.single('profilePhoto'), async (req, res) => {
    try {
        await consultantController.consultantAddProfilePhoto(req.body.id, req.file)
        res.status(200).json({ status: "success", message: `consultant ${req.body.id} profile photo upload successful` })
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `consultant ${req.body.id} profile update failed` })
    }
})

// action: update consultant timetable
// req.body: { id: "string", data: timetable obj }
// tested
router.post('/profile/timetable/get', async (req, res) => {
    try {
        await consultantController.consultantUpdateTimetable(req.body.id, req.body.data)
        res.status(200).json({ status: "success", message: `consultant ${req.body.id} timetable update successful` })
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `consultant ${req.body.id} timetable update failed` })
    }
})

// action: update consultant password
// req.body: { id: "string", oldPassword: "string", newPassword: "string" }
// tested
router.post('/profile/password/update', async (req, res) => {
    try {
        let result = await consultantController.consultantUpdatePassword(req.body)
        res.status(200).json(result)
    }
    catch (e) {
        console.error(e)
        res.status(200).json({ status: "error", message: `consultant ${req.body.id} password update failed` })
    }
})

// return consultant unread notification count
// req.body: { id: "string" }
// tested
router.post('/toolbar/notification-count/get', async (req, res) => {
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